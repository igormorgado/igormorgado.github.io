---
layout: post
title: "Seamless game world"
date: 2018-06-06
author: "Igor Morgado"
---

## Introduction

One of my passions is gaming, with electronic gaming (video games) and board games being on top of the gaming class. From a long time I have spend days drafting about game engines, game design and game programming. 

These days are long gone, and now I have started a personal project to write a real game (besides all those pongs, move the character over map, and text games that I created learning new gaming libraries and programing).

When talking about game genders action adventures with nice decision choices are my top choice. I enjoy walk through new worlds and see what is hidding in the next corner. What are the sick ideas in the mind of the designers.

Most things are written here are still draft and are just an idea. No real implementations yet.


## Motivation

When walking in a world a few things are worse than loading screens, we can accept a loadscreen while starting the game or teleporting to a distant locations (the teleport itself can be disguised in a load screen), but load screens to open a door house or move further throught a bridge is unaceptable. Many great games did that, but they would be better without it.

How can we create a huge game world (by huge I mean at least 100 sq. kilometers wide) and access it without loading, or at least with non noticiable load.

The main concerns here are about **time to access** the data (must be done faster than user moves along the map), that would be simply solved if we load all map in memory, but that brings a second issue **memory limit**, how can we load a map that is bigger than memory itself?


### A grid world

For sake of example lets take a classical game as *Nintendo's The Legend of Zelda* 

{% include image.html url="/images/gameworld1/zelda_gameplay.jpg" description="The legend of Zelda" %}

In this game the player always see a single area as the picture above. No matter where on the screen the player, no matter if is in the center, near any of the bushes or screen boundaries. It always see the same screen

{% include image.html url="/images/gameworld1/zelda_in_zone.jpg" description="Some examples of possible locations, here we added a little more of the surrounding maps just for sake of information, but the players ONLY sees wht is inside the red box" %}


First things first, lets create our fictional game world and call it **WORLD**, everytime i use the bold captilized word **WORLD** I will be making reference to the definition that we will discuss now.

By my own limitations the game world is a tiled gameworld, it means I will discretize every  in world by a single element in a array.