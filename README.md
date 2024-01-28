1. User lands on home page.
2. Websocket connection is made automatically.
3. User enters a name or is filled automatically on clicking Play Now/Join Room.
4. Clicking Play Now, sends a CreateUser http request and stores the user info into global store.
5. Subsequently, send an associate_client event to associate the user with client
6. 