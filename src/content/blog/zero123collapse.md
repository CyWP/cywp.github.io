---
title: "Zero123Collapse"
description: "Messing with multiview image generation models."
pubDate: "Jan 12 2026"
updatedDate: "Jan 12 2026"
hide: false
tags:
  - featured
  - art
  - code
preview_image: "/img/0123/preview.gif"
---

<div style="margin-top:4rem"></div>

Visual experiments using a pretrained [Zero123](https://zero123.cs.columbia.edu/) model in a recursive generation loop.

<div style="margin-top:2rem"></div>

Associated code can be found [here](https://github.com/CyWP/Zero-123-Collapse).

<div style="margin-top:2rem"></div>

These first experiments are simply an iterative rotation on the azimuth axis of the previous generation.

<div style="margin-top:2rem"></div>

<video controls> <source src="/img/0123/sk3.mp4" type="video/mp4" ></source></video>

<div style="margin-top:2rem"></div>

<video src="/img/0123/rose.mp4" controls></video>

<div style="margin-top:2rem"></div>

<video src="/img/0123/cat.mp4" controls></video>

<div style="margin-top:2rem"></div>

Zero-123 is heavily biased, and mainly used for geometric optimization rather than outright image generation. Compounded error into collapse was expected, but nowhere near that fast (2-5 frames). Given that the model is designed to transform the input conditioning image, it never actually collapses to a single mode, making for interesting animations. 

<div style="margin-top:2rem"></div>

![](/img/0123/dreamfusion_samples.png)
*This also helps to explain why tools using Zero-123 such as [Dreamfusion](https://dreamfusion3d.github.io/) generate such saturated and canonical/simplistic output.*