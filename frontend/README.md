# Player

## sendPlayerName

- In Succes:

  ```json
  {
      status:200,
      ok: true,
      name:'string',
      id: 'string',
      detail 'msg'
  }
  ```

- In Failure:
  ```JSON
  {
      // status: 400:, Status is missing in the response
      ok:false ,
      detail: 'Error while validating the name'
  }
  ```

---

# Game

## createGame

- Succes

  ```json
  {
  	status: 200,
    	ok: true
    	detail: "Game *nameOfTheGame* created successfully.",
      game_id: *numberOfId*
  }
  ```

  - Failure

    ```json
    {
    	status: 400,
      	ok: false
      	detail: "Game *nameOfTheGame* created successfully.",
    }
    ```

## getLobyState

- In Succes:

  ```json
  {
      status:200,
      ok: true,
      players:[{userName: 'str', isHost: bool}],
      canStart: bool,
      detail 'msg'
  }
  ```

- In Failure:

  ```JSON
  {
      status: 400:,
      ok:false ,
      // can_start: bool  -> need to checkout
      detail: 'msg'
  }
  ```

## joinGame

- In Succes:

  ```json
  {
      status:200,
      ok: true,
      // Need to check the data send from the server
      detail 'msg'
  }
  ```

- In Failure:

  ```JSON
  {
      status: 400:,
      ok:false ,
      // can_start: bool  -> need to checkout
      detail: 'msg'
  }
  ```

# getGameStatus

- In Succes:

  ```json
  {
      status:200,
      ok: true,
  	players: [{userName: 'str', position: int, isAlive: bool}],
      myPosition: int,
      detail 'msg'
  }
  ```

- In Failure:

  ```JSON
  {
      status: 400:,
      ok:false ,
      detail: 'msg'
  }
  ```

---

# Cards

## getNewCard

- In Succes:

  ```json
  {
      status:200,
      ok: true,
      hand:[cardToken],    // Need to check if it's right
      detail 'msg'
  }
  ```

- In Failure:

  ```JSON
  {
      status: 400:,
      ok:false ,
      detail: 'msg'
  }
  ```

## getHandStatus

- In Succes:

  ```json
  {
      status:200,
      ok: true,
      hand:[cardToken],    // Need to check if it's right
      detail 'msg'
  }
  ```

- In Failure:

  ```JSON
  {
      status: 400:,
      ok:false ,
      detail: 'msg'
  }
  ```
