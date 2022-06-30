# Wizard Game simulation

A small-scale duelist-esque game simulation done in JS.

I didn't feel as if Polymorphistic paradigms were to be followed since having a base entity class
did not feel justified enough to be had due to the differing qualities of Heroes and Monsters.

The only properties they share are:

* `health`
* `type`

And their respective methods didn't feel like they could've share anything (besides maybe `damage`?)