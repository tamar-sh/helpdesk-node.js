import Comment from "../models/commentsModel.js";

export const createCommentAsync = async (commentData) => {
  const comment = new Comment(commentData);
  return await comment.save();
};
export const getAllCommentsAsync = async (filter = {}) => {
  return await Comment.find(filter);
};

export const getCommentByIdAsync = async (commentId) => {
  return await Comment.findById(commentId);
};
export const updateCommentAsync = async (commentId, updatedData) => {
  return await Comment.findByIdAndUpdate(commentId, updatedData, { new: true });
};
export const deleteCommentAsync = async (commentId) => {
  return await Comment.findByIdAndDelete(commentId);
};

 