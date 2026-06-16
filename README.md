# hoon-loader
a simply html loader for hoon files combined with a subtle compiler project program

```
hoon loader

----

inputs: 1,2

|= [a=ud b=@b] %- add a b
output: 3

----

%- sin 90
output: 0.8939966636005579

----

%- sin %- sin 90
output: 0.77958108276669

----

%- add %- add 1 2 2
output: 5

----

%- add 1 %- add 2 2
output: 5

----

%- add 1 %- add 2 %- add 1 1
output: 5
```
