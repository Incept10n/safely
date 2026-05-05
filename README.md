To launch the app use 

```make clean-start``` reset db state, build containers, run all containers<br>
```make all``` just lauch everything (no rebuilding containers)<br>
```make down``` stop the app (compose down every running contianer)<br>

then open it on ```localhost:80```<br>

```make db``` only start db<br>
```make backend``` only start backend<br>
```make frontend``` only start frontend<br>
```make fullstack``` start frontend and backend<br>

```make build-all``` build frontend and backend containers<br>
```make build-backend ``` build backend container<br>
```make build-frontend``` build frontend container<br>

```make clean``` read Makefile to see what it does
