---
layout: post
title: "A markdown test"
date: 2018-05-23
---

## Introduction

This is a *simple* webpage to create all **HTML** tags for markdown. It will 
be used as a sandbox to write a **_CSS_** that matches the one used in 
[main layout](/index.html).

> Cubum autem in duos cubos, aut quadratoquadratum in duos 
> quadratosquadratos, et generaliter nullam in infinitum ultra 
> quadratum potestatem in duos ejusdem nominis fas est dividere: 
> cujus rei demonstrationem mirabilem sane detexi. Hanc marginis 
> exiguitas non caperet.

### A sub title

Here I will add some ipsum lorem text as a filler.  Lorem ipsum dolor sit amet, 
consectetur adipiscing elit. Mauris nec lobortis urna, sit amet mattis neque. 
Suspendisse tempor, ipsum sollicitudin sollicitudin rutrum, quam quam 
sollicitudin leo, vel interdum nulla lacus non nisi. Pellentesque dictum 
ligula sapien, eu maximus sem imperdiet vitae. Duis tristique, mauris pretium 
auctor rhoncus, erat metus efficitur enim, eu porta dolor nunc id lorem. 
Praesent congue mi metus, ac interdum enim hendrerit sit amet. 

Nam ultricies elit sit amet aliquet rutrum. Ut pharetra est metus, eu accumsan 
dolor scelerisque vel. Nullam id imperdiet mi. Nulla turpis massa, efficitur 
non dapibus sed, elementum et justo. Duis volutpat consectetur lectus, sit 
amet malesuada magna ultrices sed.

#### A subsub title

Aliquam fringilla augue in blandit viverra. Sed posuere sollicitudin velit, sed 
fringilla sapien varius ac. Duis tincidunt ultricies tincidunt. Sed semper mi 
in rhoncus semper. Phasellus imperdiet egestas posuere. Nulla eget diam at 
metus sagittis sodales. Praesent luctus nisl tortor, vitae convallis nisi 
ullamcorper nec. Maecenas et justo eu velit condimentum porta quis sit amet 
turpis.

012345789 012345789 012345789 012345789 012345789 012345789 012345789 012345789 
012345789 012345789 012345789 012345789 012345789 012345789 012345789 012345789 
012345789 012345789 012345789 012345789 012345789 012345789 012345789 012345789 
012345789 012345789 012345789 012345789 012345789 012345789 012345789 012345789 
012345789 012345789 012345789 012345789 012345789 012345789 012345789 012345789 
012345789 012345789 012345789 012345789 012345789 012345789 

## Another section

![Pierre de Fermat](https://upload.wikimedia.org/wikipedia/commons/f/f3/Pierre_de_Fermat.jpg)

To show our friend  Pierre de Fermat. 
Nam ultricies elit sit amet aliquet rutrum. Ut pharetra est metus, eu accumsan 
dolor scelerisque vel. Nullam id imperdiet mi. Nulla turpis massa, efficitur 
non dapibus sed, elementum et justo. Duis volutpat consectetur lectus, sit 
amet malesuada magna ultrices sed.

And a numbered list

1. One;

2. Two; and

3. Three.

And a unumbered one:

* Item 1

* Item 2

* Item 3


### Tables are important too

Here we will see the same table shown in the main page

| ID  | Field   | Data   |
|-----|:-------:|-------:|
|  1  | Group 1 | 0.2123 |
|  2  | Group 2 | 0      |
|  3  | Group 3 | 1      |
|  4  | Group 4 | 13     |
|  5  | Group 5 | 145    |
|  6  | Group 6 | 10.2   |

## Some code

Also we need to display some code as:

```C
#include <stdlib.h>
#include <math.h>
#include <unistd.h>

#include "globals.h"
#include "parse.h"

#include "utils.h"
#include "tic.h"

#include "velocity_model.h"
#include "ricker.h"
#include "wavefield.h"
#include "simulation.h"

int main(int argc, char *argv[])
{
    args *ap = arg_parse(argc, argv, stdout);
    
    /* Create velocity model */
    velocity_model *model = velocity_model__create(ap->nx, ap->nz, ap->dx, ap->dz);
    velocity_model__constant_velocity(model, ap->vel);

    /* Create the source */
    ricker_wavelet *wavelet = ricker__create(ap->frequency);
    ricker_source  *source  = ricker__model(wavelet, ap->sx, ap->sz, ap->sd); 

    /* Create simulation */
    simulation_params *simulation = simulation__create();
    simulation->time = ap->time;
    simulation->sample = ap->sample;

    /* Create simulation */
    simulation->dt = stable_dt(model);
    simulation->steps = simulation->time / simulation->dt + 1;
    simulation->ntrec = simulation->sample/simulation->dt;

    /* Test stability */
    if(isstable(source, model, simulation) != SIMUL_OK)
    {
      fprintf(stderr, "Unstable model\n");
      exit(EXIT_FAILURE);
    }
    
    /* Create data */
    ricker__create_trace(wavelet, simulation->time, simulation->dt);
    wavefield *P = wavefield__create(model->nx, model->nz);

    /* Pre calculate  Laplacian parameters */
    laplacian_params *lp = wavefield__laplacian_params(model, 
                                                       ap->order, 
                                                       simulation->dt);
    
    /* Iterate timesteps */
    for(size_t it = 0; it < simulation->steps; it++)
    {
        simulation__inject_source(P, model, source, simulation, it);
        wavefield__laplacian(P, model, lp);
        wavefield__perfect_match_layer(P, model, lp);
        wavefield__swap(P);
        simulation__write(it, P, simulation, stdout, ticprt);
    }

    /* Memory  cleanup */
    fflush(stdout);
    simulation__destroy(simulation);
    wavefield__destroy_laplacian_params(lp);
    wavefield__destroy(P);
    ricker__destroy_source(source);
    velocity_model__destroy(model);
    free(ap);

    /* Finishing */
    if(ticprt) {
        fprintf(stderr, "TOTAL ");
        tic();
    }

    if(verbose)
        fprintf(stderr, "xmovie n1=%zu n2=%zu d1=%lf d2=%lf clip=0.5 loop=2\n", 
                ap->nx, ap->nz, ap->dx, ap->dz);

    fflush(stderr);

    return 0;
}
```

And that is it!

