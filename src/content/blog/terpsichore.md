---
title: "Terpsichore"
description: "Teachable gestural controller."
pubDate: "May 01 2024"
updatedDate: "May 01 2024"
hide: false
tags:
  - featured
  - code
preview_image: "/img/terpsichore/banner.png"
---

<div style="margin-top:4rem"></div>

Terpsichore is a GUI application enabling users to build their own custom gesture recognition/classification models using both recorded and live video footage, using Tensorflow's [MoveNet](https://www.tensorflow.org/hub/tutorials/movenet) for pose recognition and a trainable classification model fro gesture recognition.

<div style="margin-top:1rem"></div>

What makes it a controller is its ability to send relevant data through the [Open Sound Control](https://mct-master.github.io/networked-music/2024/03/17/thomaseo-intro_to_OSC.html) (OSC) protocol, which is typically used by other maker-related or artistic digital applications as the principal mean of data communication.

<div style="margin-top:1rem"></div>

Info on usage and installation can be found on the [README page](https://github.com/CyWP/Terpsichore).

<div style="margin-top:4rem"></div>

## Record

<div style="margin-top:2rem"></div>

The Record page lets the user add gestures for their model to eventually classify, as well as basic management tools for them (adding, removing, …). During recording (either through video or webcam), the application records the point values of the interpolated pose in a csv file to be loaded at training.

<div style="margin-top:2rem"></div>

![](/img/terpsichore/terp_record.png)

<div style="margin-top:4rem"></div>

## Train

<div style="margin-top:2rem"></div>

This page is where the user can launch the training of their model with the data they previously recorded. The interface is kept simple, letting them choose the epochs and test split size. Once training is launched, the user has access to training logs, current performance and the stage of training. The model is a shallow ConvNet with a set time window for sequential poses as movement.

<div style="margin-top:2rem"></div>

![](/img/terpsichore/terp_train.png)

<div style="margin-top:4rem"></div>

## Perform

<div style="margin-top:2rem"></div>

The perform page is where the user can launch a live recording and dispatching of data, which is split in 4 parts:

<div style="margin-top:1rem"></div>

1. Classification: Classification of trained movements. Can be output as softmax or argmax.

<div style="margin-top:1rem"></div>

2. Pose data: A list of 17 points, each with an x and y value indicating their location on the canvas.

<div style="margin-top:1rem"></div>

3. Movement data: delta for every recorded point per frame.

<div style="margin-top:1rem"></div>

4. Extremity movement: aproximation of 3D movement of extremities (ankles, wrists).

<div style="margin-top:2rem"></div>

![](/img/terpsichore/terp_perform.png)

*Above, the 17 points that are tracked using tensorflow's movenet model.*

<div style="margin-top:4rem"></div>

## Demo

<div style="margin-top:2rem"></div>

A demo was created by training a model on the most recurring movements of [Milena Sidorova's "Spider" ballet](https://milenasidorova.com/spider/). Classification and movement output is mapped to user-specifiable 3d modeling operations in Blender using [this add-on](https://github.com/CyWP/Terp-Blend) I developed for this purpose.

<div style="margin-top:2rem"></div>

<iframe
  src="https://www.youtube.com/embed/ZgozzAkAv3M?si=nWOMc5CyDxLWrj23"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>