import socket,time


TCP_IP = '127.0.0.1'
TCP_PORT = 6969
BUFFER_SIZE = 1024
MESSAGE = '{"id":"abcdefgh","state":"ON"}'
while 1:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((TCP_IP, TCP_PORT))
    s.send(MESSAGE)
    data = s.recv(BUFFER_SIZE)
    s.close()

    print "received data:", data
    time.sleep(2)
