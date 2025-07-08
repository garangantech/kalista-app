const BASE_URL = "https://4cbe8c981504.ngrok-free.app/api";

export const API = {
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,
  logout: `${BASE_URL}/logout`,
  edukasi: `${BASE_URL}/edukasi`,
  edukasiDetail: (id) => `${BASE_URL}/edukasi/${id}`,

  // Forum
  forumAsk: `${BASE_URL}/forum`,
  forumReply: `${BASE_URL}/forum/reply`,
  forumUnhandled: `${BASE_URL}/forum/unhandled`,
  forumHandle: `${BASE_URL}/forum/handle`,
  forumMyQuestions: `${BASE_URL}/forum/my-questions`,
  forumHandled: `${BASE_URL}/forum/handled`,
  forumClose: `${BASE_URL}/forum/close`,
  forumReplies: (id) => `${BASE_URL}/forum/${id}/replies`,
};
