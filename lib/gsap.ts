'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Единственное место регистрации плагинов. Компоненты берут gsap отсюда.
gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

export { gsap, ScrollTrigger, useGSAP };
