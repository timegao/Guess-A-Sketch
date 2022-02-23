# Guess-A-Sketch

http://guess-a-sketch.herokuapp.com/

## Overview

Guess-A-Sketch is a multiplayer game that is a remote online synchronous groupware application, whose inspiration stems from to the well-known board game, Pictionary.

### Limitations

The following is a listing of application limitations effective the first application release:

- Guess-A-Sketch is intended for desktop, laptop, and tablet players in a one-device to one-user setting.
- Guess-A-Sketch supports mouse inputs and touch with finger or stylus. We do not recommend the user experience on mobile devices such as phones currently because of the limited screen size.
- At the time of release, the game only consists of one single round. A single round is defined as every player currently in the game having had the opportunity to draw exactly once. The game will end after each round.
- The canvas does not support window/screen resizing. For the best user experience, we recommend NOT resizing the window after the game has loaded.
- The canvas does not translate or transform canvas drawing across different aspect ratios. A drawing may look different from one screen to another depending on the window's aspect ratio.
- Erase functionality currently simulates erasing by simply overlaying a white stroke color on the existing white background of the canvas element, instead of removing drawn paths from the existing canvas. On the other hand, please note that the clear button, does in fact clear the canvas content.
- Upon clicking the eraser button, our currently deployed application may cause the line width for all existing drawn paths on canvas to change width. This is not an intended effect and is an open issue.
- Due to the limitations of the free-tier Dyno Type, which has less than 1GB of RAM, Heroku may crash and may not restart itself. The connection to Heroku dynos may not always be the most stable. Players' socket sometimes disconnect, and players may not always receive the most up-to-date information.

### Key Characteristics

The following are key characteristics of the game:

- It supports interaction between multiple users via real-time chat and canvas drawing element.
- The application manipulates and displays data from multiple sources, including data directly supplied by the user in the chat or canvas using socket.io, as well as mock data consisting of words that are to be guessed during gameplay.
- Redux principles are applied throughout the application to manage state.
- The application responds to user input via mouse and keyboard and touch interfaces such as finger and stylus.
- The application supports different users in multiple contexts:
  - Firstly, a tutorial is required for both novice and experienced users alike prior to starting and joining gameplay.
  - Secondly, inherent to regular gameplay, there are two user roles, those who draw and those who guess. As such, two respective and differing views are provided, dependent on whether the user draws or guesses.
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
    - Displaying a clock on the header to reflect the amount of time remaining.
    - Displaying hints about the word to guess during the time allotted for drawing/guessing.
    - Displaying a check mark on the guessers’ cards in the player list after they guessed correctly during a turn.
    - Modal component announcing each change in the game state.

## Gameplay

Gameplay requires at least 2 players. If a player joins the game, but there are not sufficient players (i.e., only 1 player), then the application provides feedback to the player by notifying them to wait for additional players to join. For the best experience, we recommend at least three players so that the scoring is meaningful.

<p align="center"> <img src="https://media.github.ccs.neu.edu/user/5522/files/5631f580-a88a-11eb-80c2-e09b228628a3"/></p>

Once at least 2 players have joined the game, the game begins and the player who joined the game first becomes a drawer. The drawer is given a choice of three of words, and all other player(s) take on the role of a guesser and attempt to guess the drawn word correctly by typing it in the chat to win points.

The player who has the role of drawer has 15 seconds to choose the word they would like to draw. Three choices are provided, one easy (green), one medium (yellow), and one hard (red). Should the player fail to choose a word in the 15 seconds provided, the player is automatically provided with the easy word to draw. During the same time, guessers all receive feedback that the drawer is currently picking a word.

Once the player has either chosen a word to draw or one has automatically been chosen for them, the player then has 90 seconds to draw the chosen word to the best of their ability.

Players are required to provide a username to identify themselves during gameplay. There cannot be duplicate usernames. Validation is performed at the time when a player attempts to join, to prevent for duplicates. Feedback is provided to the player so it can provide a different username currently not in use.

<p align="center"> <img src="https://media.github.ccs.neu.edu/user/5522/files/68179680-a892-11eb-87a8-b7103704e13f"/></p>

While the currently designated drawer draws the word, all other players attempt to correctly guess the word as quickly as possible. The quicker they guess, the more points they get!

As the 90 seconds elapses, hints about the word are revealed at timed intervals. Words of length 4 or less are provided a single letter hint at the 45 second mark. Alternatively, should the word be of length 5 or longer, single letter hints are provided at the 60, 30, and 15 second marks.

When users guess the word, they receive feedback if the word that they guess is close to the word that the drawer/system picked. If they guess the word correctly, then all users receive feedback that the player guessed the word correctly. If the [edit distance](https://en.wikipedia.org/wiki/Edit_distance) of the word that they guessed is less than or equal to 2 characters, then only the user receives feedback from the server as a special type of message that they had a close guess. If the player already guessed the word correctly and guesses the same word again, then they receive a different message from the server that they had already guessed the word.

Following the 90 seconds, points earned by each player during the turn are revealed during an 8 second end of turn intermission. Scoring for drawer is based on an exponential formula that considers the amount of time that it took for the first guesser to guess the word correctly and the difficulty of the word selected. Likewise, the scoring for the guesser is also based on the same formula based on the time, but it also uses another exponential formula based on the order in which the guesser guessed the word correctly in comparison to other drawers. We chose to use exponential formulas because we wanted to be able to scale to a larger number of potential users while also ensuring that players would never receive 0 or fewer points every round should they guess the word correctly.

<p align="center"> <img src="https://media.github.ccs.neu.edu/user/5522/files/bd55a700-a896-11eb-9145-e50e46a1df00"/></p>

Gameplay then continues, as a new drawer is chosen, and a new turn begins. Once all players have had the opportunity to draw, a single round of gameplay has finished, and the game is over. Overall point standings and winners are revealed during a 10 second intermission, before a brand-new game starts.

Players may leave the game at any time by simply closing their internet browser window, or by clicking the close button icon in the top left corner of the game view and then confirming that they would like to exit.

## Reflection

The idea for the project is not new but derived from another game, [sketchful.io](https://sketchful.io/), which we found online. After initial prototyping, we were able to determine that the project is feasible from a programmatic standpoint. It was a fun but simple interactive game that's hilarious to play among friends, especially among computer science majors who tend to be more or less artistically challenged. We chose to simplify some of the gameplay elements, like having a set amount of time to draw regardless of the difficulty of the word and reducing the amount of points that a player can score every turn down to 100, reducing the game to one round at a time, eliminating animations and sounds due to a lack of skills and manpower, and just having one lobby that can fit any number of people as opposed to multiples. Overall, we've very happy with the progress that we were able to make in the two weeks that we had employed and the amount of features that we were able to implement within the time.

We encountered numerous challenges throughout the development of our application. Firstly was adequately grappling with the scope and size of the amount of state management required for our application. The design of our project was ever-evolving during the entirety of the project. This led to repeated refactoring and changes to the organization of our application state brought about by new considerations and additional features added. Although refactoring is part of any project, larger changes to application state proved to be more laborious mid-way through the development process. If we had initially performed a more thorough survey of considerations and explicitly outlined said considerations in mind as we developed the application, much of the growing pains associated with redefining application states could have been avoided. In addition to design architecture, adequate and accurate time estimation of work also proved to be a challenge. Working under what ended up being a two-week sprint during and right before finals week was already challenging enough, but we also sometimes found ourselves fumbling as we would underestimate the time necessary to research, implement, consider edge cases, debug issues, and user test intended features. Because of the industriousness of the team, we were able to complete the project to satisfaction, but if we were to redo the project, we would dedicate more time and collective effort in system design.
