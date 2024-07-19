from fastapi_socketio import SocketManager

socket_manager = None

def init_socket_manager(app):
    global socket_manager
    socket_manager = SocketManager(app)
