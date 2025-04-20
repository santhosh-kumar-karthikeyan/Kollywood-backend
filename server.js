const { app, server } = require("./src/app");
const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
    console.log(`Server listening at port ${PORT}`);
});