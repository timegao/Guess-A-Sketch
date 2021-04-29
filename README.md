# Project Description – Guess-A-Sketch

http://guess-a-sketch.herokuapp.com/

## Overview

Guess-A-Sketch is a multiplayer game that is a remote online synchronous groupware application, whose inspiration stems from to the well-known board game, Pictionary.

## Limitations

The following is a listing of application limitations effective the first application release:

- Guess-A-Sketch is intended for desktop, laptop, and tablet players in a one-device to one-user setting.
- Guess-A-Sketch supports mouse inputs and touch with finger or stylus. We do not recommend the user experience on mobile devices such as phones currently.
- The game only consists of one single round. A single round is defined as every player currently in the game having had the opportunity to draw exactly once. The game will end after every round. This provides for future extensibility to define a game to consist of multiple rounds.
- Please note that the canvas does not resize based on window/screen size. For the best user experience, we recommend NOT resizing the window after the game has loaded.
- Erase functionality currently simulates erasing by simply overlaying a white stroke color on the existing white background of the canvas element, instead of removing drawn paths from the existing canvas. On the other hand, the clear button, does in fact clear the canvas content.
- Upon clicking the eraser button, our currently deployed application causes the line width for all existing drawn paths on the canvas to change width. This is not an intended effect and is an open issue we are unable to replicate locally.

## Key Characteristics

The following are key characteristics of the game:

- It supports interaction between multiple users via a real-time chat and canvas drawing element.
- The application manipulates and displays data from multiple sources, including data directly supplied by the user in the chat or canvas, as well as mock data consisting of words that are to be guessed during gameplay.
- Redux principles are applied throughout the application to manage state.
- The application responds to user input via mouse and keyboard and touch interfaces such as stylus and finger.
- The application supports different users in multiple contexts:
  - Firstly, a tutorial is provided for both novice and experienced users alike, prior to starting and joining gameplay.
  - Secondly, inherent to regular gameplay, there are two user roles, those who draw, and those who guess. As such, two respective and differing views are provided, dependent on whether the user is drawing or guessing.
- The UI communicates application state to players to keep coordination during gameplay and provide feedback.
- The UI supports group awareness by:
  - Chat messages distributed to all users:
    - When a new player joins and leaves the game.
    - Announcing the next drawer at the beginning of the turn.
    - Announcing and revealing the answer at the end of the turn.
    - Announcing when the round is over.
    - Announcing when the game is over.
  - Graphical content:
    - Displaying a pencil on the drawer’s card in the player list.
    - Displaying a check mark on the guessers’ cards in the player list after they guessed correctly during a turn.
    - Modal component announcing each change in the game state.

## Gameplay

Gameplay requires at least 2 players. If a player joins the game, but there are not sufficient players (i.e., only 1 player), then the application provides feedback to the player by notifying them to wait for additional players to join.

<p align="center"> <img src="https://media.github.ccs.neu.edu/user/5522/files/5631f580-a88a-11eb-80c2-e09b228628a3"/></p>

Once at least 2 players have joined the game, the game begins with the player who joined the game first as the first designated drawer. The drawer is given a choice of three of words, and all other player(s) take on the role of a guesser and attempt to guess the drawn word by typing it in the chat to win points.

The player who has the current role of drawer, initially has 15 seconds to choose the word they would like to draw. Three choices are provided, one easy, one medium, and one hard. Should the player fail to choose a word in the 15 seconds provided, the player is automatically provided with the easy word to draw. During the same time, guessers all receive feedback that the drawer is currently picking a word.

Once the player has either chosen a word to draw or one has automatically been chosen for them, the player then has 90 seconds to draw the provided word to the best of their ability

<p align="center"> <img src="https://media.github.ccs.neu.edu/user/5522/files/68179680-a892-11eb-87a8-b7103704e13f"/></p>

While the currently designated drawer draws the word, all other players attempt to correctly guess the word as quickly as possible. The quicker they guess, the more points they get!

As the 90 seconds elapses, hints about the word are revealed at timed intervals. Words of length 4 or less are provided a single letter hint at the 45 second mark. Alternatively, should the word be of length 5 or longer, single letter hints are provided at the 60, 30, and 15 second marks.

When users guess the word, they receive feedback if the word that they guess is close to the word that the drawer/system picked. If they guess the word correctly, then all users receive feedback that the player guessed the word correctly. If the edit distance of the word that they guessed is less than or equal to 2 characters, then only the user receives feedback from the server as a special type of message that they had a close guess. If the player already guessed the word correctly and guesses the same word again, then receive a different message from the server that they had already guessed the word.

Following the 90 seconds, points earned by each player during the turn are revealed during an 8 second end of turn intermission. Scoring for drawer is based on an exponential formula that considers the amount of time that it took for the first guesser to guess the word correctly and the difficulty of the word selected. Likewise, the scoring for the guesser is also based on the same formula based on the time, but it also considers the order in which the guesser guessed the word correctly in comparison to other drawers, which is another exponential formula. We chose exponential formulas because we wanted to be able to scale to a larger number of potential users while also ensuring that players would never receive 0 or fewer points every round should they guess the word correctly.

<p align="center"> <img src="https://media.github.ccs.neu.edu/user/5522/files/bd55a700-a896-11eb-9145-e50e46a1df00"/></p>

Gameplay then continues, as a new drawer is chosen, and a new turn begins. Once all players have had the opportunity to draw, a single round of gameplay has finished, and the game is over. Overall point standings and winners are revealed during a 10 second intermission, before a brand-new game starts.

Players may leave the game at any time by simply closing their internet browser window, or by clicking the close button icon in the top left corner of the game view and then confirming that they would like to exit.
