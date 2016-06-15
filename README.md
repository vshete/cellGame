README.md
Working of the game:
This is a simple game of uncoloring the colored check boxes in a grid before the countdown ends. You can change the grid size (square grid) and the number of cell you will uncolor, the time you will take to uncover those cells and how many chances you need. By default you will be given N - 1 seconds to uncover N cells in three chances which can be changed.

If you fail to uncover the colored cells you will be asked in the dialog box if you would like to retry (if you have any chances left) or close (Resets the game).

If you succeed you will be shown a dialog box which congratulates you. Pressing close button in this dialog will reset the game.

Technology:
Stack: Express - Angualr.js
A simple express server has been created to serve the game. No database has been used.

Instructions for use:
Clone the repository. To start using first install the npm packages using npm install --save.
Then start the server with npm start.
The server can be accessed at localhost:3000
