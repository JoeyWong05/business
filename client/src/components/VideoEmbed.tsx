import React from "react";

interface VideoEmbedProps {
  videoUrl: string;
  videoType?: "loom" | "youtube" | "vimeo";
  title?: string;
  width?: string | number;
  height?: string | number;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
}

export default function VideoEmbed({ 
  videoUrl,
  videoType = "loom",
  title = "Embedded video",
  width = "100%",
  height = 400,
  autoPlay = false,
  muted = false,
  className = "",
}: VideoEmbedProps) {
  const getEmbedUrl = () => {
    switch (videoType) {
      case "loom":
        // Convert Loom share URL to embed URL if needed
        if (videoUrl.includes("/share/")) {
          const loomId = videoUrl.split("/share/")[1].split("?")[0];
          return `https://www.loom.com/embed/${loomId}`;
        } else if (videoUrl.includes("/embed/")) {
          return videoUrl;
        } else {
          // Try to extract ID from various Loom URL formats
          const loomMatch = videoUrl.match(/loom\.com\/(.*?)($|\?)/);
          if (loomMatch && loomMatch[1]) {
            const possibleId = loomMatch[1].replace(/^v\//, '');
            return `https://www.loom.com/embed/${possibleId}`;
          }
          return videoUrl;
        }
      
      case "youtube":
        // Extract YouTube video ID and format as embed URL
        let ytVideoId = "";
        if (videoUrl.includes("youtu.be/")) {
          ytVideoId = videoUrl.split("youtu.be/")[1].split("?")[0];
        } else if (videoUrl.includes("youtube.com/watch")) {
          const params = new URLSearchParams(videoUrl.split("?")[1]);
          ytVideoId = params.get("v") || "";
        } else if (videoUrl.includes("youtube.com/embed/")) {
          ytVideoId = videoUrl.split("youtube.com/embed/")[1].split("?")[0];
        }
        return `https://www.youtube.com/embed/${ytVideoId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}`;
      
      case "vimeo":
        // Extract Vimeo video ID and format as embed URL
        let vimeoId = "";
        if (videoUrl.includes("vimeo.com/")) {
          vimeoId = videoUrl.split("vimeo.com/")[1].split("?")[0].split("/")[0];
        }
        return `https://player.vimeo.com/video/${vimeoId}?autoplay=${autoPlay ? 1 : 0}&muted=${muted ? 1 : 0}`;
      
      default:
        return videoUrl;
    }
  };

  return (
    <div className={`video-embed-container ${className}`}>
      <iframe
        src={getEmbedUrl()}
        width={width}
        height={height}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
        className="rounded-md"
      ></iframe>
    </div>
  );
}