// socket.io.ts
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

let io: Server;

function setupSocketIO(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === 'production'
          ? ['https://tudominio.com'] // Cambia por tu dominio en producción
          : '*', // En desarrollo permite todo
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Configuraciones adicionales recomendadas
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Middleware de autenticación (opcional pero recomendado)
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        console.warn('🔐 Socket connection without token');
        // Por ahora permitimos conexiones sin token para desarrollo
        socket.data.user = { id: 'anonymous', isAuthenticated: false };
        return next();
      }

      // Aquí validarías el token JWT
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // socket.data.user = { id: decoded.userId, isAuthenticated: true };

      // Por ahora, token dummy para desarrollo
      socket.data.user = { id: 'user123', isAuthenticated: true };
      next();
    } catch (err) {
      console.error('🚫 Socket authentication failed:', err);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log('🟢 Usuario conectado:', {
      socketId: socket.id,
      user: socket.data.user,
      timestamp: new Date().toISOString(),
    });

    // Event: Unirse a un proyecto
    socket.on('join_project', (projectId) => {
      try {
        if (!projectId) {
          console.warn('⚠️ join_project called without projectId');
          return;
        }

        const roomName = `project:${projectId}`;
        socket.join(roomName);

        console.log(`✅ User ${socket.data.user?.id || 'unknown'} joined ${roomName}`);

        // Opcional: notificar a otros usuarios del proyecto
        socket.to(roomName).emit('user:joined', {
          userId: socket.data.user?.id,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('❌ Error joining project:', error);
      }
    });

    // Event: Salir de un proyecto
    socket.on('leave_project', (projectId) => {
      try {
        if (!projectId) {
          console.warn('⚠️ leave_project called without projectId');
          return;
        }

        const roomName = `project:${projectId}`;
        socket.leave(roomName);

        console.log(`👋 User ${socket.data.user?.id || 'unknown'} left ${roomName}`);

        // Opcional: notificar a otros usuarios del proyecto
        socket.to(roomName).emit('user:left', {
          userId: socket.data.user?.id,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('❌ Error leaving project:', error);
      }
    });

    // Event: Desconexión
    socket.on('disconnect', (reason) => {
      console.log('🔴 Usuario desconectado:', {
        socketId: socket.id,
        user: socket.data.user,
        reason,
        timestamp: new Date().toISOString(),
      });
    });

    // Event: Manejo de errores
    socket.on('error', (error) => {
      console.error('💥 Socket error:', error);
    });
  });

  // Manejo global de errores de Socket.IO
  io.engine.on('connection_error', (err) => {
    console.error('🚫 Socket.IO connection error:', {
      code: err.code,
      message: err.message,
      context: err.context,
      type: err.type,
    });
  });

  return io;
}

// Función helper para obtener la instancia de io
function getIO(): Server {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call setupSocketIO first.');
  }
  return io;
}

export { getIO, setupSocketIO };
