// ===== GAS 連携 =====
const GAS_API_URL =
  "https://script.google.com/macros/s/AKfycbx7VC5n8mdFr-cNAzDDR3O4qFa1e6JdCLHM_E4pm8JbCpMZocXUC9g3IFJ3dyb_Eh14Ug/exec";

let view; // ArcGIS の MapView を外からも使えるように
let surveyLayer; // Survey123 レイヤー
let artworks = []; // Survey から生成した作品リスト

let artworkLikes = {};
let currentArtwork = null;
let hasLiked = false;

// ブラウザにいいね状態を保存
let likedArtworks = JSON.parse(localStorage.getItem("likedArtworks") || "{}");

let bottomInstruction;

/**
 * GAS へ JSONP でリクエストする共通関数
 */
function gasJsonpRequest(params = {}) {
  return new Promise((resolve, reject) => {
    const callbackName =
      "gasJsonpCb_" + Date.now() + "_" + Math.floor(Math.random() * 10000);

    window[callbackName] = function (result) {
      try {
        resolve(result);
      } finally {
        const script = document.getElementById(callbackName);
        if (script) script.remove();
        delete window[callbackName];
      }
    };

    const qs = new URLSearchParams({
      ...params,
      callback: callbackName,
    }).toString();
    const urlWithParams = `${GAS_API_URL}?${qs}`.replace(
      /\/macros\/u\/\d+\/s\//,
      "/macros/s/"
    );

    const script = document.createElement("script");
    script.id = callbackName;
    script.src = urlWithParams;

    script.onerror = (e) => {
      const s = document.getElementById(callbackName);
      if (s) s.remove();
      delete window[callbackName];
      reject(e);
    };

    document.head.appendChild(script);
  });
}

/**
 * アクセス数をカウントする関数
 */
async function logAccessToGAS() {
  try {
    await gasJsonpRequest({ action: "logAccess" });
    console.log("アクセスを記録しました");
  } catch (e) {
    console.error("アクセス記録に失敗", e);
  }
}

async function fetchAllLikesFromGAS() {
  return gasJsonpRequest({ action: "readLikes" });
}

async function incrementLikeOnGAS(artworkId) {
  return gasJsonpRequest({ artworkId: String(artworkId) });
}

// === ArcGIS Map の初期化 & Survey 読み込み ===
require([
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/geometry/Polygon",
  "esri/geometry/Point",
  "esri/geometry/geometryEngine",
], (WebScene, SceneView, Polygon, Point, geometryEngine) => {
  // WebScene を読み込む
  const scene = new WebScene({
    portalItem: {
      id: "824c34a6b9134c67a8f649d027a08e0c",
    },
  });

  // SceneView を生成
  view = new SceneView({
    container: "mapView",
    map: scene,
    // 画角などの制限
    constraints: {
      tilt: {
        max: 80,
        mode: "manual",
      },
      snapToZoom: false,
    },
    // ナビゲーション（操作）を完全無効化
    navigation: {
      browserTouchPanEnabled: false,
      mouseWheelZoomEnabled: false,
      gamepad: {
        enabled: false,
      },
      momentumEnabled: false,
    },
  });

  // view が完全に読み込まれてから、残りの処理を行う
  view.when(async () => {
    document.getElementById("mapLoading").classList.add("hide");
    setTimeout(() => {
      document.getElementById("mapLoading").style.display = "none";
    }, 400);

    // UIコンポーネントを全消去
    view.ui.components = [];

    // あらゆる操作イベントを停止して地図を完全固定
    // ★修正: immediate-click (クリック) は停止しないように除外しました
    const stopProp = (event) => {
      event.stopPropagation();
    };

    view.on("drag", stopProp);
    view.on("key-down", stopProp);
    view.on("mouse-wheel", stopProp);
    view.on("double-click", stopProp);
    view.on("two-finger-tap", stopProp);
    // view.on("immediate-click", stopProp); // ←これを削除（クリック反応を復活させるため）

    view.environment = {
      ...view.environment,
      starsEnabled: false,
      atmosphere: {
        quality: "low",
      },
    };

    // ポップアップ無効化
    view.popup.autoOpenEnabled = false;
    view.popup.visible = false;
    view.map.allLayers.forEach((layer) => {
      if ("popupEnabled" in layer) {
        layer.popupEnabled = false;
      }
    });
    window.view = view;

    // 初期カメラ位置
    const initialCamera = {
      position: {
        x: 15544158,
        y: 4236153,
        z: 2500,
        spatialReference: { wkid: 102100, latestWkid: 3857 },
      },
      heading: 0,
      tilt: 40,
    };
    view.goTo(initialCamera, { animate: false });

    // Survey123 レイヤー取得
    surveyLayer = view.map.allLayers.find(
      (lyr) => lyr.title === "survey" || lyr.id === "survey"
    );

    if (surveyLayer) {
      await loadArtworksFromSurvey();
    } else {
      console.warn("Survey layer not found.");
    }

    // 地図が止まったタイミングでマーカーを再描画
    view.watch("stationary", (v) => {
      if (v && artworks.length) {
        renderMarkers();
      }
    });
  });
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  logAccessToGAS();

  bottomInstruction = document.querySelector(".bottom-instruction");
  document.getElementById("mapGuideButton").style.display = "none";
  bottomInstruction.classList.remove("show");

  const endButton = document.querySelector(".header-back-button");
  const endPopup = document.getElementById("endPopup");
  const backToTopButton = document.getElementById("backToTopButton");
  const goToWorkshopButton = document.getElementById("goToWorkshopButton");
  const cancelEndButton = document.getElementById("cancelEndButton");
  const endBackdrop = document.querySelector(".end-popup-backdrop");

  function openEndPopup() {
    endPopup.classList.remove("hidden");
  }

  function closeEndPopup() {
    endPopup.classList.add("hidden");
  }

  if (endButton) {
    endButton.addEventListener("click", (e) => {
      e.preventDefault();
      openEndPopup();
    });
  }

  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }

  if (goToWorkshopButton) {
    goToWorkshopButton.addEventListener("click", () => {
      window.location.href =
        "https://docs.google.com/forms/d/e/1FAIpQLSeSGh8sGe47gxGbr9ikMCzr5L-RHMObzyRJo4onLc4fnZEitw/viewform?usp=header";
    });
  }

  if (cancelEndButton) {
    cancelEndButton.addEventListener("click", closeEndPopup);
  }
  if (endBackdrop) {
    endBackdrop.addEventListener("click", closeEndPopup);
  }
});

function closeSiteGuide() {
  document.getElementById("siteGuide").classList.add("hidden");
  document.getElementById("mapGuideButton").style.display = "flex";
  bottomInstruction.classList.add("show");
}

function showSiteGuide() {
  document.getElementById("siteGuide").classList.remove("hidden");
  document.getElementById("mapGuideButton").style.display = "none";
  bottomInstruction.classList.remove("show");
}

// 固定コメント一覧
const COMMENT_TABLE = [
  {
    artworkKey: "逃げる",
    date: "12月9日",
    author: "匿名user",
    text: "模様がすごく綺麗で魅力的です！",
  },
  {
    artworkKey: "逃げる",
    date: "12月9日",
    author: "みのわ",
    text: "人の色がだんだんと変化しているのがすごいと思いました。",
  },
  {
    artworkKey: "逃げる",
    date: "12月8日",
    author: "匿名user",
    text: "素敵な絵で、作品に込められた想いがよく伝わってきました。",
  },
  {
    artworkKey: "逃げよう",
    date: "12月10日",
    author: "みのわ",
    text: "馴染みのある場所なので、よく考えさせられました。共感します。",
  },
  {
    artworkKey: "逃げよう",
    date: "12月9日",
    author: "サワダ",
    text: "マーブリングの配色にセンスを感じます…！！",
  },
  {
    artworkKey: "逃げよう",
    date: "12月9日",
    author: "匿名user",
    text: "防災グッズはまだ用意できてないので、早めに準備したいと思いました！",
  },
  {
    artworkKey: "揺れる水",
    date: "1月7日",
    author: "みのわ",
    text: "説明が専門的でわかりやすく、勉強になりました。",
  },
  {
    artworkKey: "揺れる水",
    date: "1月6日",
    author: "キリマンジャロ",
    text: "水道管が破裂している様子がよく表現されていて、怖さが伝わりました。",
  },
  {
    artworkKey: "揺れる水",
    date: "1月6日",
    author: "匿名user",
    text: "ローリングストックという言葉は初めて聞いたので調べましたが、防災において大切な行動であると知りました。",
  },
  {
    artworkKey: "空を求めて",
    date: "1月9日",
    author: "キリマンジャロ",
    text: "背景のピンク色も素敵ですが、光の表現がトクニ美しい。。",
  },
  {
    artworkKey: "空を求めて",
    date: "1月8日",
    author: "たけちゃんまま",
    text: "タイトルをはじめ、作品も非常に美しく、アーティストの感性を感じますが、防災の観点からも考えさせられました。",
  },
  {
    artworkKey: "空を求めて",
    date: "1月8日",
    author: "匿名user",
    text: "災害時もめげずに空を見上げてポジティブに居たい。適切な避難行動をとります。",
  },
  {
    artworkKey: "もしもの",
    date: "1月9日",
    author: "匿名user",
    text: "川が近いですもんね…。避難場所の確認を改めてしようと思いました！",
  },
  {
    artworkKey: "もしもの",
    date: "1月8日",
    author: "サワラ",
    text: "ハザードマップをもう一度見てみようと思いました！",
  },
  {
    artworkKey: "もしもの",
    date: "1月8日",
    author: "YOUNGJUN",
    text: "ハザードマップをマーブリングで丁寧に表現していることが伝わった。アート自体から地域の危険性を読み取れる。What a masterpiece！",
  },
];

function getArtworkKeyFromMessage(message) {
  if (!message) return null;
  const normalized = message.replace(/[！!]/g, "").trim();

  // 「大雨」の判定は削除済み
  if (normalized.startsWith("逃げる")) return "逃げる";
  if (normalized.startsWith("逃げよう")) return "逃げよう";
  if (normalized.startsWith("揺れる水")) return "揺れる水";
  if (normalized.startsWith("空を求めて")) return "空を求めて";
  if (normalized.startsWith("もしもの")) return "もしもの";
  return null;
}

function getFixedCommentsForArtwork(message, fallbackArtworkId) {
  const key = getArtworkKeyFromMessage(message);
  if (!key) return [];

  const rows = COMMENT_TABLE.filter((row) => row.artworkKey === key);
  if (rows.length === 0) return [];

  return rows.map((row) => ({
    author: row.author,
    text: row.text,
    timestamp: row.date,
    likes: 3,
  }));
}

async function loadArtworksFromSurvey() {
  if (!surveyLayer) return;

  const query = surveyLayer.createQuery();

  query.where = `
    Message LIKE '逃げる%' OR 
    Message LIKE 'もしもの%' OR 
    Message LIKE '逃げよう%' OR 
    Message LIKE '揺れる水%' OR 
    Message LIKE '%揺れる水%' OR
    Message LIKE '空を求めて%'
  `;

  query.outFields = ["objectid", "Message", "field_25", "Mabling", "collage"];
  query.returnGeometry = true;
  query.returnAttachments = true;

  const result = await surveyLayer.queryFeatures(query);
  const attachmentInfo = await surveyLayer.queryAttachments({
    objectIds: result.features.map((f) => f.attributes.objectid),
  });

  if (result.features.length > 0) {
    const geometries = result.features.map((f) => f.geometry);

    // 作品群が「ギリギリ収まる」位置へカメラを移動
    // 左右のpaddingを80に設定して見切れを防ぐ
    await view.goTo(
      {
        target: geometries,
        tilt: 40,
      },
      {
        animate: false,
        padding: { top: 100, bottom: 120, left: 80, right: 80 },
      }
    );

    // 完全固定
    view.constraints.minScale = view.scale;
    view.constraints.maxScale = view.scale;
  }

  artworks = result.features.map((f) => {
    const a = f.attributes;
    const oid = a.objectid;

    let imageUrl = "";
    if (attachmentInfo[oid] && attachmentInfo[oid].length > 0) {
      const att = attachmentInfo[oid][0];
      imageUrl = att.url;
    }

    return {
      id: oid,
      title: a.Message || "(タイトル未入力)",
      author: a.field_25 || "作者不明",
      imageUrl,
      description: "",
      marbling: a.Mabling || "",
      collage: a.collage || "",
      likes: 0,
      geometry: f.geometry,
      comments: getFixedCommentsForArtwork(a.Message, oid),
    };
  });

  // デフォルトで 5〜10 のランダムな数値を設定
  artworkLikes = {};
  artworks.forEach((a) => {
    artworkLikes[a.id] = Math.floor(Math.random() * 6) + 5;
  });
  renderMarkers();

  // GASから最新のいいね数を取得して上書き
  (async () => {
    try {
      const res = await fetchAllLikesFromGAS();
      if (res && res.success && res.likesData) {
        Object.keys(res.likesData).forEach((id) => {
          const serverCount = Number(res.likesData[id] || 0);
          if (serverCount > (artworkLikes[id] || 0)) {
            artworkLikes[id] = serverCount;
          }
        });

        renderMarkers();
        if (currentArtwork) updateLikeButton();
      }
    } catch (e) {
      console.error("いいねの読み込みに失敗しました (GAS)", e);
    }
  })();
}

function getScreenPositionPercent(geometry) {
  if (!view || !geometry) return { top: -999, left: -999 };

  const screenPt = view.toScreen(geometry);
  const rect = view.container.getBoundingClientRect();

  return {
    left: (screenPt.x / rect.width) * 100,
    top: (screenPt.y / rect.height) * 100,
  };
}

// 画面座標(px)を取得するヘルパー関数
function getScreenPositionPixels(geometry) {
  if (!view || !geometry) return { x: -999, y: -999 };
  const screenPt = view.toScreen(geometry);
  return { x: screenPt.x, y: screenPt.y };
}

function renderMarkers() {
  const container = document.getElementById("markersContainer");
  if (!container || !view) return;

  container.innerHTML = "";
  if (!artworks.length) return;

  // --- 衝突判定＆位置調整ロジック ---
  // マーカーサイズに合わせて判定範囲を調整（アイコン80px化に伴い縮小）
  const MARKER_W = 100;
  const MARKER_H = 120;

  // 1. 作品マーカーをリスト化
  let layout = artworks.map((art) => {
    const pt = getScreenPositionPixels(art.geometry);
    return {
      type: "artwork",
      data: art,
      screenX: pt.x,
      screenY: pt.y,
      width: MARKER_W,
      height: MARKER_H,
    };
  });

  // 2. 「共助の芽」もレイアウト計算に含める
  // まず作品の重心（平均位置）を計算
  if (layout.length > 0) {
    const centerX =
      layout.reduce((sum, item) => sum + item.screenX, 0) / layout.length;
    const centerY =
      layout.reduce((sum, item) => sum + item.screenY, 0) / layout.length;

    // 芽をレイアウト配列に追加（これで衝突判定の対象になる）
    layout.push({
      type: "sprout",
      count: artworks.length,
      screenX: centerX,
      screenY: centerY,
      width: 100, // 芽の判定サイズ（概算）
      height: 100,
    });
  }

  // 3. 重なりを解消するために反復計算
  const iterations = 10;
  for (let k = 0; k < iterations; k++) {
    for (let i = 0; i < layout.length; i++) {
      for (let j = i + 1; j < layout.length; j++) {
        let dx = layout[i].screenX - layout[j].screenX;
        let dy = layout[i].screenY - layout[j].screenY;

        // 判定閾値（両者のサイズの平均をとる）
        const threshX = (layout[i].width + layout[j].width) / 2;
        const threshY = (layout[i].height + layout[j].height) / 2;

        if (Math.abs(dx) < threshX && Math.abs(dy) < threshY) {
          const overlapX = threshX - Math.abs(dx);
          const overlapY = threshY - Math.abs(dy);

          // 重なりが小さい方の軸に沿って押し広げる
          if (overlapX < overlapY) {
            const shift = overlapX / 2 + 5;
            const sign = dx > 0 ? 1 : -1;
            const safeSign = dx === 0 ? (Math.random() > 0.5 ? 1 : -1) : sign;

            layout[i].screenX += shift * safeSign;
            layout[j].screenX -= shift * safeSign;
          } else {
            const shift = overlapY / 2 + 5;
            const sign = dy > 0 ? 1 : -1;
            const safeSign = dy === 0 ? (Math.random() > 0.5 ? 1 : -1) : sign;

            layout[i].screenY += shift * safeSign;
            layout[j].screenY -= shift * safeSign;
          }
        }
      }
    }
  }
  // ---------------------------------

  const rect = view.container.getBoundingClientRect();

  // レイアウト計算後の座標を使って描画
  layout.forEach((item) => {
    const pos = {
      left: (item.screenX / rect.width) * 100,
      top: (item.screenY / rect.height) * 100,
    };

    if (item.type === "artwork") {
      const markerEl = createArtworkMarker(item.data, pos);
      container.appendChild(markerEl);
    } else if (item.type === "sprout") {
      // 芽の生成
      const clusterData = { position: pos, count: item.count };
      const sproutEl = createSproutMarker(clusterData);
      container.appendChild(sproutEl);
    }
  });
}

function createSproutMarker(cluster) {
  const sprout = document.createElement("div");
  sprout.className = "sprout-marker";
  sprout.style.top = `${cluster.position.top}%`;
  sprout.style.left = `${cluster.position.left}%`;

  sprout.innerHTML = `
    <div>
      <div class="sprout-glow"></div>
      <div class="sprout-plant">
        <div class="sprout-stem"></div>
        <div class="sprout-leaves">
          <div class="sprout-leaf sprout-leaf-left"></div>
          <div class="sprout-leaf sprout-leaf-right"></div>
        </div>
        <div class="sprout-flower">
          ${[0, 72, 144, 216, 288]
            .map(
              (rotation, i) => `
            <div class="flower-petal" style="transform: rotate(${rotation}deg) translateY(-8px); animation-delay: ${
                0.8 + i * 0.1
              }s;"></div>
          `
            )
            .join("")}
          <div class="flower-center"></div>
        </div>
      </div>
      <div class="sprout-sparkle">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      </div>
    </div>
  `;

  sprout.onclick = () => handleSproutClick(cluster, sprout);
  return sprout;
}

let sproutInfoTimer = null;

function handleSproutClick(cluster, sproutElement) {
  const markers = document.querySelectorAll(".artwork-marker");
  markers.forEach((m) => m.classList.add("hidden-artwork"));

  const oldOverlay = document.querySelector(".sprout-magic-overlay");
  if (oldOverlay) oldOverlay.remove();

  const overlay = document.createElement("div");
  overlay.className = "sprout-magic-overlay";
  document.body.appendChild(overlay);

  const rect = sproutElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const maxDist = Math.hypot(window.innerWidth, window.innerHeight) * 1.6;
  const count = 140;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "sprout-glitter";

    const angle = Math.random() * Math.PI * 2;
    const distance = maxDist * (0.4 + Math.random() * 0.6);

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    p.style.left = `${centerX}px`;
    p.style.top = `${centerY}px`;
    p.style.setProperty("--dx", `${dx}px`);
    p.style.setProperty("--dy", `${dy}px`);

    overlay.appendChild(p);
  }

  // ★修正：タップ時に説明文を表示
  const info = document.getElementById("sproutInfo");
  const infoText = document.getElementById("sproutInfoText");
  if (info && infoText) {
    infoText.innerHTML = `${cluster.count}つの作品によって<br>共助の芽が育っています！`;
    info.classList.add("show");

    if (sproutInfoTimer) clearTimeout(sproutInfoTimer);
    sproutInfoTimer = setTimeout(() => {
      info.classList.remove("show");
    }, 4000);
  }

  setTimeout(() => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }, 1200);
}

function createArtworkMarker(artwork, position) {
  const marker = document.createElement("div");
  const isPopular = artworkLikes[artwork.id] > 35;

  marker.className = `artwork-marker ${isPopular ? "popular" : ""}`;
  marker.style.top = `${position.top}%`;
  marker.style.left = `${position.left}%`;
  marker.onclick = () => openModal(artwork);

  marker.innerHTML = `
    <div class="marker-container">
      <div class="marker-image-wrapper" style="width: 80px; height: 80px;">
        <img src="${artwork.imageUrl}" alt="${
    artwork.title
  }" class="marker-image">
      </div>
      <div class="marker-overlay">
        <p class="marker-title">${artwork.title}</p>
        <p class="marker-author">${artwork.author}</p>
        <p class="marker-description">${artwork.description}</p>
      </div>
      <div class="marker-likes">
        <svg viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>${artworkLikes[artwork.id]}</span>
      </div>
      ${isPopular ? '<div class="marker-popular-badge">✨人気</div>' : ""}
    </div>
    <div class="marker-tap-hint">タップ！</div>
  `;

  return marker;
}

// Open modal
function openModal(artwork) {
  currentArtwork = artwork;

  // localStorage を見て、この作品を既にいいねしているか確認
  hasLiked = !!likedArtworks[artwork.id];

  const modal = document.getElementById("artworkModal");
  document.getElementById("modalImage").src = artwork.imageUrl;
  document.getElementById("modalTitle").textContent = artwork.title;
  document.getElementById(
    "modalAuthor"
  ).textContent = `作者：${artwork.author}`;

  const descEl = document.getElementById("modalDescription");
  const marblingText = artwork.marbling || "";
  const collageText = artwork.collage || "";

  if (marblingText || collageText) {
    descEl.innerHTML = `
      <div class="description-block">
        <p class="description-label">マーブリングで表現したこと：</p> 
        <p class="description-text">${marblingText || "（記入なし）"}</p>
      </div>
      <div class="description-block">
        <p class="description-label">コラージュで表現したこと：</p> 
        <p class="description-text">${collageText || "（記入なし）"}</p>
      </div>
    `;
  } else {
    descEl.textContent = artwork.description || "";
  }

  updateLikeButton();
  renderComments(artwork.comments);

  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("artworkModal");
  modal.classList.remove("show");
  document.body.style.overflow = "";
  currentArtwork = null;
  hasLiked = false;
}

// Update like button
function updateLikeButton() {
  const button = document.getElementById("likeButton");
  const buttonText = document.getElementById("likeButtonText");
  const likeCount = document.getElementById("likeCount");
  const icon = button.querySelector(".like-icon");

  if (hasLiked) {
    button.classList.add("liked");
    button.disabled = true; // いいね済みの場合は押せない
    buttonText.textContent = "作者の想いを受け取りました！";
    icon.style.fill = "white";
  } else {
    button.classList.remove("liked");
    button.disabled = false;
    buttonText.textContent = "想いを受け取る！";
    icon.style.fill = "none";
  }

  likeCount.textContent = `地域で${
    artworkLikes[currentArtwork.id] || 0
  }人が共感しています`;
}

// Handle like
async function handleLike() {
  if (!currentArtwork) return;

  // いいね状態をローカルストレージに保存
  hasLiked = true;
  likedArtworks[currentArtwork.id] = true;
  localStorage.setItem("likedArtworks", JSON.stringify(likedArtworks));

  const id = String(currentArtwork.id);

  // 画面上のカウントを即座に増やして反映させる
  artworkLikes[currentArtwork.id] = (artworkLikes[currentArtwork.id] || 0) + 1;
  updateLikeButton();
  renderMarkers(); // マップ上のマーカーの数字も更新

  // アニメーション
  const btn = document.getElementById("likeButton");
  btn.classList.add("liked-animate");
  setTimeout(() => btn.classList.remove("liked-animate"), 600);
  createHeartExplosion();

  // サーバーへ送信
  try {
    const result = await incrementLikeOnGAS(id);

    if (result && result.success) {
      console.log("いいねの保存に成功しました (GAS/JSONP)");
      if (typeof result.newCount === "number") {
        // サーバーからの最新値があれば同期
        if (result.newCount > artworkLikes[currentArtwork.id]) {
          artworkLikes[currentArtwork.id] = result.newCount;
          updateLikeButton();
          renderMarkers();
        }
      }
    } else {
      console.error("いいねの保存に失敗しました (GAS/JSONP)", result);
    }
  } catch (e) {
    console.error("いいねの保存に失敗しました (GAS/JSONP)", e);
  }
}

function createHeartExplosion() {
  const container = document.getElementById("heartExplosion");
  container.innerHTML = "";

  for (let i = 0; i < 12; i++) {
    const heart = document.createElement("div");
    heart.className = "heart-particle";

    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;

    heart.style.setProperty("--x", `${x}px`);
    heart.style.setProperty("--y", `${y}px`);

    heart.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    `;

    heart.style.animation = `heartFly 0.8s ease-out forwards`;
    heart.style.transform = `translate(${x}px, ${y}px)`;

    container.appendChild(heart);
  }

  setTimeout(() => {
    container.innerHTML = "";
  }, 1000);
}

function renderComments(comments) {
  const commentsList = document.getElementById("commentsList");
  const commentCount = document.getElementById("commentCount");

  commentCount.textContent = `(${comments.length})`;

  commentsList.innerHTML = comments
    .map(
      (comment) => `
    <div class="comment-item">
      <div class="comment-header">
        <p class="comment-author">${comment.author}</p>
        <span class="comment-timestamp">${comment.timestamp}</span>
      </div>
      <p class="comment-text">${comment.text}</p><div class="comment-likes">
        <svg viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>${comment.likes}</span>
      </div>
    </div>
  `
    )
    .join("");
}

document.addEventListener("click", (e) => {
  const modal = document.getElementById("artworkModal");
  if (e.target === modal) {
    closeModal();
  }
});

window.closeSiteGuide = closeSiteGuide;
window.showSiteGuide = showSiteGuide;
window.handleLike = handleLike;
window.closeModal = closeModal;
