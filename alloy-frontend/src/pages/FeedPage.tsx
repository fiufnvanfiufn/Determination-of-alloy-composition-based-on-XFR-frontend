import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alloys, getAlloysFeed } from "../modules/alloysApi";

const defaultImage = "/default.png";
const defaultVideo = "/default.mp4";

export const FeedPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [alloy, setAlloy] = useState<Alloys | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const idParam = searchParams.get("id");
  const nextParam = searchParams.get("next") === "true";

  useEffect(() => {
    setVideoFailed(false);
    setIsExpanded(false);
    const id = idParam ? parseInt(idParam, 10) : undefined;
    getAlloysFeed(id, nextParam).then((res) => {
      setAlloy(res.alloy);
      setLikes(res.likes);
    });
  }, [idParam, nextParam]);

  if (!alloy) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Загрузка...</div>;
  }

  const handleNext = () => {
    setSearchParams({ id: String(alloy.id), next: "true" });
  };

  const videoSrc = alloy.video_url || defaultVideo;
  const imageSrc = alloy.image_url || defaultImage;

  return (
    <div className="feed-container">
      {/* Медиа-блок ограниченной высоты (не на весь экран) */}
      <div className="feed-media-wrapper">
        {!videoFailed ? (
          <video
            key={videoSrc}
            className="feed-media"
            src={videoSrc}
            poster={imageSrc}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoFailed(true)}
          />
        ) : (
          <img
            className="feed-media"
            src={imageSrc}
            alt={alloy.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = defaultImage;
            }}
          />
        )}
      </div>

      {/* Нижний блок: слева серая плашка с описанием, справа параметры НАД лайком */}
      <div className="feed-bottom-row">
        <div className="feed-info-card">
          <div className="feed-title">{alloy.title}</div>

          {!isExpanded ? (
            <p className="feed-description-preview">{alloy.description}</p>
          ) : (
            <div className="feed-details-content">
              <p className="feed-description">{alloy.description}</p>
            </div>
          )}

          <button
            type="button"
            className="feed-more-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "▼ свернуть" : "▶ еще"}
          </button>
        </div>

        {/* Правая колонка: параметры НАД кнопкой лайка и кнопкой далее */}
        <div className="feed-actions">
          <div className="feed-params-right">
            <div className="feed-param-box">
              <div className="feed-label">Частота</div>
              <div className="feed-value">{alloy.energy_kev} кэВ</div>
            </div>
            <div className="feed-param-box">
              <div className="feed-label">Интенсивность</div>
              <div className="feed-value">{alloy.intensity_cps} cps</div>
            </div>
          </div>

          <div className="heart-block">
            <div className="heart-circle">🤍</div>
            <span className="likes-count">{likes}</span>
          </div>

          <button type="button" className="next-circle-btn" onClick={handleNext}>
            ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
