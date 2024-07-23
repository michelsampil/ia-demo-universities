from fastapi_socketio import SocketManager

socket_manager = None

def init_socket_manager(app):
    global socket_manager
    socket_manager = SocketManager(app)

    @socket_manager.on("connect")
    async def handle_connect(sid):
        print(f"Client connected: {sid}")

    @socket_manager.on("disconnect")
    async def handle_disconnect(sid):
        print(f"Client disconnected: {sid}")

    @socket_manager.on("time")
    async def handle_time(sid, data):
        print(f"Received time data: {data}")
        await socket_manager.emit("time", data)
