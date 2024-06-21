export default () => ({
    jwtAT: {
      secret: process.env.AT_SECRET,
    },
    jwtRT: {
      secret: process.env.RT_SECRET
    }
});