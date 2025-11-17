const MediaItem = ({ media_url, media_type }) => {
    if (!media_url) return null;
  
    if (media_type === "video") {
      return (
        <video
          src={media_url}
          controls
          className="w-full h-auto rounded-lg object-cover"
        />
      );
    }
  
    return <img src={media_url} alt="Media" className="w-full h-auto rounded-lg object-cover" />;
  };
  
  export default MediaItem;
  
  