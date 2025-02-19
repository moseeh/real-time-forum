export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMs = now - date;
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Just now - less than a minute ago
  if (diffInSecs < 60) {
    return "just now";
  }

  // Minutes ago - less than an hour
  if (diffInMins < 60) {
    return `${diffInMins} ${diffInMins === 1 ? "minute" : "minutes"} ago`;
  }

  // Hours ago - less than 24 hours
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  // Yesterday/Days ago - less than 7 days
  if (diffInDays < 7) {
    if (diffInDays === 1) {
      return "yesterday";
    }
    return `${diffInDays} days ago`;
  }

  // Past week - show month and date
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};
