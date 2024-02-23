const dummy = (blogs) => 1;

const totalLikes = (list) => {
  return list.reduce((prev, { likes }) => prev + likes, 0);
};

const favoriteBlog = (list) => {
  return list.reduce((favBlog, current) => {
    return favBlog.likes <= current.likes ? current : favBlog;
  });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};