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

{% include image.html url="/images/gameworld1/grid_over_grid.png" description="Figure 8: A stack of three 2d grids." %}

But lets not limit ourselves to 3 grids, lets supose we pack 30 grids one over another as shown in *figure 9*.

{% include image.html url="/images/gameworld1/cube.png" description="Figure 9: A 3d grid, every cell is related to a tile and is numbered based on (x,y,z) coordinate." %} 

In the 3D Grid the things get even bigger, and very fast since every new layer on top of a plane is alike a whole new map of equal size.

For now we can imagine that the **WORLD** is like the *figure 9* but instead a grid of size *30x30x30* we have a grid of size *100.000 x 100.000 x 1.000*, isn't easiliy drawable and that is just to materialize our idea, the core idea is infinity, But lets keep going.

### A bonding window

Lets go back to our 2D representation (it's easier to draw and notice details), take a look af *figure 10*. The red filled square is the original player location in the game world grid (the exact coordinates do not matter), the red box around its all content in memory. There is no need to bring all data to memory just the data around a smart radius (in this case was 12 squares), do not care right now for the dots, just look to the whole red area (that also includes the dots, we will discuss them later).

{% include image.html url="/images/gameworld1/grid2d_move.png" description="Figure 10: Player location and tiles on memory on initial position(red) and after some movement (blue). The red dotted area describes the information that should be discarded and the blue dotted area shows the information that should be read to memory" %}

When the player moves to another location, now represented by the blue square (green arrow shows the movement), the new bounding window is the one represented by the dashed blue area (including the area with the blue dots). But notice now, that the area with the red dots are outside of window and therefore need to be removed from memory (for sake economy), and the blue dotted area (as you can figure out), is the information that NEEDs to be read into the memory.

It's very important to notice that there was no need to read the whole area around the character, just the new content. How that content is organized (is matter to another article).

By doing that, we can keep the memory usage under control, no matter the size of our map, in memory there is only a fixed ammount of grids.

The bounding window is often related to the player view area plus some area surrounding it, to make movement smooth (we will discuss the steps for that in another article).

But, another issue cames in, if grid is too big, will be hard to address all the content also, the I/O will be huge since we will keep reading areas on disk that can be too far apart. We will try to mitigate that slicing our data.

### Slicing the grid

As you could probably noticed, in our grids we  have drawn some light grey boundaries and some black boundaries. We can think of the grey boundaries as tiles inside a map and the black boundaries as limits of a chunk of map that is stored in a separated file, the exact amount of tiles per map isn't important.

Note that the **WORLD** is the collections of all map files, glued one aside of the other (how this glue is done, we will discuss in another moment).

One thing that is very important is the number os tiles per map file, is finite and well know. We can fix, for example *1000 x 1000* tiles per map. (in figure we show just a few tiles because draw 1000 lines isn't possible), therefore the size of each file is very manageable, it can be probably load completely in the memory in a good enough machine.

And one amazing thing, no matter where the player is, it never touches more than 4 map files per time. One restriction here is that the bounding window is never bigger than the smallest map file. Looking the numbers, it will never be, since the bounding window is associated with the player view screen, that barely goes larger than *30 x 30* and we can preload some neighboor areas to make things smoother, that goes like *50 x 50* since we can consider that the player never moves faster than 10 tiles per second, we can always adapt the surround area just by knowing the fastest speed that any player can move in a second and preloading the double ammount of it. In the other hand a map file should have at least *1000 x 1000* tiles in a compressed format.

Another important aspect is the coordinate system. There is no local coordinate system, the coordinates are absolute based in the whole map, being (0,0) a map orgin, maps connected in boundaries have their coordinates summed as we can see in *figure 11*.

{% include image.html url="/images/gameworld1/mapcoords.png" description="Figure 11: Shows the grid coordinates on boundaries. There is no local map file coordinates, all coordinates are absolute to the **WORLD**." %}

### Getting to the border

But what happens when the player is very near of a border and it needs data that is outside the file map he is right now? This should not be an issue since as we can see from *figure 10*, is impossible to the player be neighboor of more than 4 maps, therefore in the worst case you will have part of 4 different files loaded on memory and the I/O seeks while not optimal are upper bounded (we will think of optimizations later).

## Infinity

With that concepts is possible to have infinite maps, limited only by the disk space (that is the cheapest) of the limits, if we take in account some compression methods as the [Blosc Library](http://blosc.org) we can have file acess faster than *memcpy* with sizes  compressed to a ratio of 10:1.

## Going 3D

The same concepts of a 2D grid can be applied to the 3D grid of the **WORLD**, the single difference is that instead a maximum of 4 files in boundaries at same time, we have 8, 4 above and 4 below if you're in a vertex. Besides that all concepts apply. In fact, we can think of the 2D case as the 3D case where the $z$ grid size is always 1.

## The WORLD tile

Once we are set in how the **WORLD** is mapped






