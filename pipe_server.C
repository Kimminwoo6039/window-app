#include <windows.h>
#include <stdio.h>

#define PIPE_NAME "\\\\.\\pipe\\kwspipe"
// gcc -o pipe_server pipe_server.c -lws2_32
int main()
{
    HANDLE hPipe;
    char buffer[128];
    DWORD dwRead;

    hPipe = CreateNamedPipe(
        PIPE_NAME,
        PIPE_ACCESS_DUPLEX,
        PIPE_TYPE_MESSAGE | PIPE_READMODE_MESSAGE | PIPE_WAIT,
        1, 128, 128, 0, NULL);

    if (hPipe == INVALID_HANDLE_VALUE)
    {
        printf("Error creating named pipe: %d\n", GetLastError());

    }

    printf("Waiting for client connection...\n");
    if (ConnectNamedPipe(hPipe, NULL) != FALSE)
    {
        printf("Client connected.\n");
          char message[] = "Hello from C program!";
                 WriteFile(hPipe, message, sizeof(message), &dwRead, NULL);
                 printf("메시지 전송됨: %s\n", message);

        while (ReadFile(hPipe, buffer, sizeof(buffer) - 1, &dwRead, NULL) != FALSE)
        {
            buffer[dwRead] = '\0';
            printf("Received: %s\n", buffer);

            // Echo the message back to the client
            WriteFile(hPipe, buffer, dwRead, &dwRead, NULL);
        }
    }
    else
    {
        printf("Error connecting to named pipe: %d\n", GetLastError());
    }

    return 0;
}
