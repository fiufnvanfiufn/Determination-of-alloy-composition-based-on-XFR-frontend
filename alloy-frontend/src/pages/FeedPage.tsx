import { type FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { type Alloys, getAlloysById } from "../modules/alloysApi";
import { ALLOYS_MOCK } from "../modules/mock";
import { ROUTES } from "../Routes";
import type { AppOutletContext } from "../AppLayout";

const defaultImage = "/default.png";
const defaultVideo = "/default.mp4";

export const FeedPage: FC = () => {
  const [pageData, setPageData] = useState<Alloys>();
  const [videoFailed, setVideoFailed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards } = useOutletContext<AppOutletContext>();

  useEffect(() => {
    setVideoFailed(false);
    setIsExpanded(false);

    if (!id) {
      const first = cards[0] || ALLOYS_MOCK.results[0];
      if (first) setPageData(first);
      return;
    }

    const fromList = cards.find((item) => String(item.id) === id);
    if (fromList) {
      setPageData(fromList);
      return;
    }

    getAlloysById(id)
      .then((data) => {
        setPageData(
          data ?? ALLOYS_MOCK.results.find((item) => String(item.id) === id)
        );
      })
      .catch(() => {
        setPageData(
          ALLOYS_MOCK.results.find((item) => String(item.id) === id)
        );
      });
  }, [id, cards]);

  const handleNext = () => {
    if (!pageData || !cards.length) return;
    const currentIndex = cards.findIndex((item) => item.id === pageData.id);
    const nextItem = cards[currentIndex + 1];
    if (nextItem) {
      navigate(`${ROUTES.FEED}/${nextItem.id}`);
    }
  };

  if (!pageData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  const videoSrc = pageData.video_url || defaultVideo;
  const imageSrc = pageData.image_url || defaultImage;

  return (
    <div className="feed-container">
      {/* Медиа-блок */}
      <div className="feed-media-wrapper">
        {!videoFailed ? (
          <video
            key={videoSrc}
            className="feed-media"
            src={videoSrc || defaultVideo}
            poster={imageSrc || defaultImage}
            onError={(event) => {
              event.currentTarget.src = defaultVideo;
            }}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            className="feed-media"
            src={imageSrc}
            alt={pageData.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = defaultImage;
            }}
          />
        )}
      </div>

      {/* Нижний блок: слева серая плашка, справа параметры + лайк + далее */}
      <div className="feed-bottom-row">
        <div className="feed-info-card">
          <div className="feed-title">{pageData.title}</div>

          {/* Если свернуто — показываем 1 строчку описания с многоточием, если развернуто — весь текст */}
          {!isExpanded ? (
            <p className="feed-description-preview">{pageData.description}</p>
          ) : (
            <div className="feed-details-content">
              <p className="feed-description">{pageData.description}</p>
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
              <div className="feed-label">Высшая частота</div>
              <div className="feed-value">{pageData.energy_kev} кэВ</div>
            </div>
            <div className="feed-param-box">
              <div className="feed-label">Вторая частота</div>
              <div className="feed-value">{pageData.intensity_cps} кэВ</div>
            </div>
          </div>

          <div className="heart-block">
            <div className="heart-circle">🤍</div>
            <span className="likes-count">{pageData.likes_count}</span>
          </div>

          <Button className="next-circle-btn" onClick={handleNext}>
            ➔
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
