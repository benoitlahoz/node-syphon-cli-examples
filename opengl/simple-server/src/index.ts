import { SyphonOpenGLServer } from 'node-syphon';

let interval;
const test = () => {
  const server = new SyphonOpenGLServer('OpenGL Server');
  console.log('Created', server.description);

  // It's up to the user to deallocate the server.
  [
    `exit`,
    `SIGINT`,
    `SIGUSR1`,
    `SIGUSR2`,
    `uncaughtException`,
    `SIGTERM`,
  ].forEach((eventType) => {
    process.on(eventType, () => {
      server.dispose();
      clearInterval(interval);
    });
  });

  interval = setInterval(() => {
    sendToServer(server);
  }, 1000 / 60);
};

const sendToServer = (server: SyphonOpenGLServer, clamp = 255) => {
  const size = 50 * 50 * 4;
  let data: any = new Uint8ClampedArray(size);

  if (server) {
    for (let i = 0; i < size; i = i + 4) {
      data[i] = Math.floor(Math.random() * Math.min(255, clamp));
      data[i + 1] = Math.floor(Math.random() * Math.min(255, clamp));
      data[i + 2] = Math.floor(Math.random() * Math.min(255, clamp));
      data[i + 3] = 255;
    }

    try {
      server.publishImageData(
        data,
        'GL_TEXTURE_2D',
        { x: 0, y: 0, width: 50, height: 50 },
        { width: 50, height: 50 },
        false
      );
    } catch (err) {
      console.error(err);
    }

    data.set([]);
    data = null;
  }
};

test();
