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

Terpsichore is a desktop application that enables users to build their own custom gesture recognition/classification models using both recorded and live video footage.
What makes it a controller is its ability to send relevant data through the Open Sound Control (OSC) protocol, which is typically used by other maker-related or artistic digital applications as the principal mean of data communication.

## Record

The Record page lets the user add gestures for their model to eventually classify, as well as basic management tools for them (adding, removing, …). During recording (either through video or webcam), the application records the point values of the interpolated pose in a csv file to be loaded at training.

![](/img/terpsichore/terp_record.png)

## Train

This page is where the user can launch the training of their model with the data they previously recorded. The interface is kept simple, letting them choose the epochs and test split size. Once training is launched, the user has access to training logs, current performance and the stage of training. The model is a shallow ConvNet with a set time window for sequential poses as movement.

![](/img/terpsichore/terp_train.png)

## Perform

The perform page is where the user can launch a live recording and dispatching of data, which is split in 4 parts:
1. Classification: Classification of trained movements. Can be output as softmax or argmax.
2. Pose data: A list of 17 points, each with an x and y value indicating their location on the canvas.
3. Movement data: delta for every recorded point per frame.
4. Extremity movement: aproximation of 3D movement of extremities (ankles, wrists).

![](/img/terpsichore/terp_perform.png)

## Demo

A demo was created by training a model on the most recurring movements of [Milena Sidorova's "Spider" ballet](https://milenasidorova.com/spider/). Classificat

<iframe
  src="https://www.youtube.com/embed/ZgozzAkAv3M?si=nWOMc5CyDxLWrj23"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

