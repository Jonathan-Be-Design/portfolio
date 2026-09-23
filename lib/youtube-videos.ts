// Public catalog shared by the carousel and the server's fixed metrics query.
// Credentials must never be added to this module: it is included in the browser.
export const reelVideos = [
  { src: '/thumbnails-2/iXCWobp75I8-HD.jpg', title: 'Pesadelo na Ilha', videoId: 'iXCWobp75I8' },
  { src: '/thumbnails-2/vUDutSKUCPw-HD.jpg', title: 'O título histórico da T1', videoId: 'vUDutSKUCPw' },
  { src: '/thumbnails-2/thumb1.jpg', title: 'CBOLÃO · Grande Final', videoId: 'J37eDmkr9Xg' },
  { src: '/thumbnails-2/mZu1CmH8IFw-HD.jpg', title: 'DRX × T1 · Final do Worlds', videoId: 'mZu1CmH8IFw' },
  { src: '/thumbnails-2/rf-U5qmLlzk-HD.jpg', title: 'T1 × BLG · Grande Final', videoId: 'rf-U5qmLlzk' },
  { src: '/thumbnails-2/jJvpO_aEcCg-HD.jpg', title: 'O melhor time do mundo?', videoId: 'jJvpO_aEcCg' },
  { src: '/thumbnails-2/inv-gWRluOo-HD.jpg', title: 'Faker × Creme · Grande Final', videoId: 'inv-gWRluOo' },
];

export const stageVideos = [
  { src: '/thumbnails-2/palco/idl-baiano-worlds-londres.jpg', title: 'Worlds em Londres · Ilha das Lendas', videoId: 'GE6CFz7hOIw' },
  { src: '/thumbnails-2/palco/baiano-worlds-capa-azul.jpg', title: 'Worlds 2024 · Costream oficial', videoId: 'By71FP3DkL8' },
  { src: '/thumbnails-2/palco/DQnLLVIRhVM-HD.jpg', title: 'Costream do CBLOL · Ilha das Lendas', videoId: 'DQnLLVIRhVM' },
  { src: '/impact/faker-lck-idl.webp', title: 'Faker · 666 vitórias na LCK', videoId: 'GNWCdEoOlaM' },
  { src: '/thumbnails-2/palco/baiano-heineken-djonga.jpg', title: 'Show do Djonga no CBLOL', videoId: 'SwsZ7G1OGIk' },
  { src: '/thumbnails-2/palco/robo-cblol-idl.jpg', title: 'Robo de Camille · Resumo LTA', videoId: 'wJdVLB2mKVo' },
  { src: 'https://i.ytimg.com/vi/Sv0ozvc8d0k/maxresdefault.jpg', title: 'Red Bull League of Its Own · T1', videoId: 'Sv0ozvc8d0k' },
];

export const youtubeVideoIds = [...new Set([...stageVideos, ...reelVideos].map(video => video.videoId))].sort();
