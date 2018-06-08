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

Most things that are written here are still draft and are just an idea. No real implementations yet.


## Motivation

When walking in a world few things are worse than loading screens, we can accept a loadscreen while starting the game or teleporting to a distant locations (the teleport itself can be disguised in a load screen), but load screens to open a door house or move further throught a bridge is unaceptable. Many great games did that, but they would be better without it.

How can we create a huge game world (by huge I mean at least 100 sq. kilometers wide) and access it without loading, or at least with non noticiable load.

The main concerns here are about **time to access** the data, it must be done faster than user moves along the map, that would be simply solved if we load all map in memory, but that brings a second issue: **memory limit**, how can we load a map that is bigger than memory itself?


### A grid world

For sake of example lets take a classical game as *Nintendo's The Legend of Zelda*,

{% include image.html url="/images/gameworld1/zelda_gameplay.jpg" description="Figure 1: The legend of Zelda" %}.

In this game the player, represented by the green hooded character *Link*, always see a single area as the picture above. No matter where on the screen the player is, no matter if *Link* is in the center, near any of the bushes or screen boundaries. It always see the same screen, as we have shown as example in the *figure 2*.

{% include image.html url="/images/gameworld1/zelda_in_zone.png" description="Figure 2: Some examples of possible locations, here we added a little more of the surrounding maps just for sake of information, but the players ONLY sees wht is inside the red box" %}

When the player touches one of the screen boundaries (in this case the top boundary isn't reacheable because there are green mountains on the way), the game makes a transition to that direction removing the actual map from memory and loading the new map. In figure 3, I show the map around our initial map.

{% include image.html url="/images/gameworld1/zelda_map_3x3_gridded.png" description="Figure 3: The maps in surroundings of our first map shown. The red lines show the limits of each map (open the image in new window for full size)" %} 

For sake of example, if *Link* touches the right boundary it will be presented to another screen, in this case the right screen shown in *figure 4*

{% include image.html url="/images/gameworld1/zelda_map_right.png" description="Figure 4: Screen shown if player moved right from original screen" %} 

Internally, the game drops all information about the previous map and load with the information about the new map. It does that for sake of memory limitation. The map is stored in a memory array as loosely represented here in C language.

```
int map[16][11] = {
    { 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 }, 
    { 2, 2, 2, 2, 2, 2, 2, 7, 2, 2, 2, 2, 2, 2, 2, 2 }, 
    { 2, 3, 0, 0, 0, 0, 0, 0, 0, 5, 3, 0, 0, 0, 5, 2 }, 
    { 3, 0, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 5 }, 
    { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
    { 0, 0, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0 }, 
    { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
    { 5, 0, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 3 }, 
    { 2, 5, 0, 0, 0, 0, 0, 0, 0, 3, 5, 0, 0, 0, 3, 2 }, 
    { 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2 }, 
    { 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2 }, 
}
```

If we make some associations for example *0* to the sand terrain, *2* to the green mountain, *3* anti diagonal green mountain, *5* diagonal mountain, *6* green rock, *7* dungeon hole and drawn in right places we have the map as imaged by the original designers. If you look enough you can even see the map inside those numbers (like an ascii art).

What is important to note is the player will never be between two zones as we imaged in *figure 5* by hypothetically putting the player where the **blue mark** is

{% include image.html url="/images/gameworld1/zelda_centered_x.png" description="Figure 5: Hypothetical and never ocurring situation in original Zelda game. The screen is NEVER centered on player, instead the player moves around the fixed screen." %}

The game design and programming choices regarding *The Legend of Zelda* were made concerned with the hardware of that time, but lets instead imagine that we could walk throught the entire game map without any load.

{% include image.html url="/images/gameworld1/zelda_map.png" description="Figure 6: The entire Zelda game world (without the dungeons that do not fit in this map), the maps were glued by some internet artist with love and spare time (open the map in new window to see it completely)." %}

There are two solutions

 1. Load the whole map in memory, in this case is around 22528 tiles, that is too much to fit the memory of old NES (2K internal ram).

 2. Load as it moves, as the character moves in a direction drops the data outside and loads new information.

The second solution was used in games launched later, *Zelda 2: The adventure of Link* used that already.

Even nowdays, many games take a mix of the two approaches where a larger than screen map is fully loaded into the  memory but only a portion of it is really drawn on screen, that area is controlled by a camera position. When a player reaches the boundaries of this area, a load screen is called, all map information is drop from memory and a new map is loaded.

This approach makes things simpler since the programmer do not need to take care about objects dinamically getting in and out of memory. 

We will try to take an approach more general but lets start do define some keywords, concepts and ideas.

### THE Grid world

First things first, lets create our fictional game world and call it **WORLD**, everytime i use the bold captilized word **WORLD** I will be making reference to the definition that we will discuss now.

By my own limitations and choices the game world is a regular homogeneous tiled gameworld, it means I will discretize every location in world by a single element in a multi dimensional array, much similar to the way of *Zelda's* approach, but there are two important differences.

**First**, the game world has infinite size, at least is very large, so large that could not fit in memory of the best computer nowdays.

**Second**, is a tridimensional world, at least for matter. Therefore the grid also expands above the plane, we can describe it as a grid on top of other grid, on top of other grid and goes on and on.

For camparison while games like *Zelda* draw over a 2D grid as shown in figure 7,

{% include image.html url="/images/gameworld1/grid2d.png" description="Figure 7: A 2d grid, every cell is related to a tile and is numbered based on (x,y) coordinate." %}

We can think of the **WORLD** as a stack of 2D grids as shown on figure 8,

{% include image.html url="/images/gameworld1/grid_over_grid.png" description="Figure 8: A stack of three 2D grids one over other.¨ %}

But not limited to 3 grids, lets supose we pack 30 grids one over another as shown in *figure 9*.

