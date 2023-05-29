// const Server = use('Server');
// use('socket.io')(Server.getInstance());

const Ws = use('Ws');

Ws.channel('datatables:*', ({ socket }) => {
  console.log(socket.topic);
});
