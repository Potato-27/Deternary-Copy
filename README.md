# Deternary re-creation

This is a project that I made last year as of writing during my in-class free time. It is a re-creation of the Geometry Dash level "Deternary" by TheRealXFuture, but using JavaScript, HTML, and CSS.

It is an emulator of a simple computer that runs using ternary logic as opposed to binary logic, and turned into a puzzle game with 5 tasks to complete by creating programs.

I originally lost all the code for this but was able to retrieve it by inspecting the page source when viewing the URL I posted it to.

## Ternary logic
Normal computers use binary, which is a base-two system with 2 distinct digits: 0 and 1. This program uses a ternary system, which in this case the three digits are 0, 1, and 2.

Despite theoretical storage efficieny with this architecture, it is too complicated from an engineering standpoint to be applied in real life, where positive, negative, and 0 voltage would be used (rather than just off or on).

## Features
- The computer implements Von Neumann architecture, so the RAM holds both the instructions and the data. This computer has 729 (3^6) memory locations, each holding an instruction and a raw value. These are displayed as base-27 digits.
- Unique glyph system with 27 unique symbols for the base-27 implementation
- 27 unique instructions that can be written in the computer
- 5 different challenges to complete, each with 5 randomly-generated test cases, with the correct solutions calculated automatically and used for checking.
- A system for user input upon being prompted, and output when returning values for the automatic checker to read
- Additional features: A stack system for "function calls, underflow/overflow and zero flags for comparison, and visuals for viewing where the current instruction is pointing to in the memory and what value is there.

## Context
I saw and tried playing the original level and thought it was super interesting, so I decided to recreate and reverse-engineer it myself. (Also because it was too difficult for me to actually beat!)

In retrospect there is a lot I would change and do differently, like making a class for memory cells instead of creating a large list of smaller lists, for example, and perhaps clean up the logic for the puzzle progression. (i.e. clean up the spaghetti)

As of the time of writing the linked architecture manual is AI generated, but I plan on remaking it myself in the near future. The data-saving part of it is also AI generated but I will leave that as is for now. Everything else is 100% authentic.

## links
- Original project in which I retrieved the files from: https://deternarycopy.tiiny.site/
- Geometry dash level which this is a recreation of: https://www.youtube.com/watch?v=cfssEWZG6oY
- Documentation for the geometry dash level: https://bit.ly/4dixVyj
All creative credit goes to TheRealXFuture and I do not claim any ownership over the ideas of this program. This is just a reverse-engineering and recreation.