<template>
  <q-layout :style="{ backgroundImage: 'url(' + photo + ')' }" class="back" ref="layout" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}">
    <q-toolbar slot="header" class="glossy topbar">
      <div v-if="info._id != null">
        <q-btn flat @click="$refs.layout.toggleLeft()">
          <q-icon name="menu" />
        </q-btn>
      </div>

      <q-toolbar-title>
        Inspire
        <div slot="subtitle">Running on Quasar v{{$q.version}}</div>
      </q-toolbar-title>
      <div v-if="info._id == null">
        <q-btn flat link @click="login">
          <q-icon name="person" />
        </q-btn>
      </div>
      <div v-else>
        <q-btn flat link @click="logout">
          <q-icon name="person" />
        </q-btn>
      </div>
    </q-toolbar>

    <div slot="left">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->
      <div>
        <todo></todo>
      </div>
    </div>

    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <div class="layout-padding logo-container non-selectable no-pointer-events">
      <div class="logo" :style="position">
        <img src="~assets/quasar-logo-full.svg">
      </div>
    </div>
  </q-layout>
</template>

<script>
  import Todo from './Todo'
  import {
    dom,
    event,
    openURL,
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    Dialog
  } from 'quasar'

  const
    { viewport } = dom,
    { position } = event,
    moveForce = 30,
    rotateForce = 40,
    RAD_TO_DEG = 180 / Math.PI

  function getRotationFromAccel(accelX, accelY, accelZ) {
    /* Reference: http://stackoverflow.com/questions/3755059/3d-accelerometer-calculate-the-orientation#answer-30195572 */
    const sign = accelZ > 0 ? 1 : -1
    const miu = 0.001

    return {
      roll: Math.atan2(accelY, sign * Math.sqrt(Math.pow(accelZ, 2) + miu * Math.pow(accelX, 2))) * RAD_TO_DEG,
      pitch: -Math.atan2(accelX, Math.sqrt(Math.pow(accelY, 2) + Math.pow(accelZ, 2))) * RAD_TO_DEG
    }
  }

  export default {
    name: 'index',
    components: {
      QLayout,
      QToolbar,
      QToolbarTitle,
      QBtn,
      QIcon,
      QList,
      QListHeader,
      QItem,
      QItemSide,
      QItemMain,
      Todo,
      Dialog,

    },
    data() {
      return {
        orienting: window.DeviceOrientationEvent && !this.$q.platform.is.desktop,
        rotating: window.DeviceMotionEvent && !this.$q.platform.is.desktop,
        moveX: 0,
        moveY: 0,
        rotateY: 0,
        rotateX: 0,
        logging: true,
      }
    },
    computed: {
      position() {
        const transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`
        return {
          top: this.moveY + 'px',
          left: this.moveX + 'px',
          '-webkit-transform': transform,
          '-ms-transform': transform,
          transform
        }
      },
      info() {
        return this.$store.state.info
      },
      photo(){
        return this.$store.state.photo
      }
    },
    methods: {
      launch(url) {
        openURL(url)
      },
      move(evt) {
        const
          { width, height } = viewport(),
          { top, left } = position(evt),
          halfH = height / 2,
          halfW = width / 2

        this.moveX = (left - halfW) / halfW * -moveForce
        this.moveY = (top - halfH) / halfH * -moveForce
        this.rotateY = (left / width * rotateForce * 2) - rotateForce
        this.rotateX = -((top / height * rotateForce * 2) - rotateForce)
      },
      rotate(evt) {
        if (evt.rotationRate &&
          evt.rotationRate.beta !== null &&
          evt.rotationRate.gamma !== null) {
          this.rotateX = evt.rotationRate.beta * 0.7
          this.rotateY = evt.rotationRate.gamma * -0.7
        }
        else {
          /* evt.acceleration may be null in some cases, so we'll fall back
             to evt.accelerationIncludingGravity */
          const
            accelX = evt.acceleration.x || evt.accelerationIncludingGravity.x,
            accelY = evt.acceleration.y || evt.accelerationIncludingGravity.y,
            accelZ = evt.acceleration.z || evt.accelerationIncludingGravity.z - 9.81,
            rotation = getRotationFromAccel(accelX, accelY, accelZ)

          this.rotateX = rotation.roll * 0.7
          this.rotateY = rotation.pitch * -0.7
        }
      },
      orient(evt) {
        if (evt.beta === null || evt.gamma === null) {
          window.removeEventListener('deviceorientation', this.orient, false)
          this.orienting = false

          window.addEventListener('devicemotion', this.rotate, false)
        }
        else {
          this.rotateX = evt.beta * 0.7
          this.rotateY = evt.gamma * -0.7
        }
      },
      logout() {
        Dialog.create({
          title: 'Are you sure you want to logout?',
          message: `Currently logged in as ${this.info.name}`,
          buttons: [
            'Cancel',
            {
              label: 'logout',
              handler: (data) => {
                this.$store.dispatch('logout')
              }
            }
          ]
        })
      },
      login() {
        Dialog.create({
          title: 'Login',
          message: 'Need an account? Press the \'Register\' button below',
          position: 'left',
          form: {
            email: {
              type: 'email',
              label: 'Email',
              model: ''
            },
            password: {
              type: 'password',
              label: 'Password',
              model: ''
            }
          },
          buttons: [
          {
              label: 'Cancel',
              color: 'negative'
            },
            {
              label: 'Login',
              color: 'positive',
              handler: (data) => {
                this.$store.dispatch('login', data)
              }
            },
            {
              label: 'Register',
              handler: () => {
                this.register()
              }
            }
          ]
        })
      },
      register() {
        Dialog.create({
          title: 'Register',
          message: 'Already have an account? Press the \'Login\' button below',
          position: 'right',
          form: {
            name: {
              type: 'text',
              label: 'Name',
              model: ''
            },
            email: {
              type: 'email',
              label: 'Email',
              model: ''
            },
            password: {
              type: 'password',
              label: 'Password',
              model: ''
            }
          },
          buttons: [
            {
              label: 'Cancel',
              color: 'negative'
            },
            {
              label: 'Login',
              color: 'positive',
              handler: () => {
                this.login()
              }
            },
            {
              label: 'Register',
              handler: (data) => {
                this.$store.dispatch('register', data)
              }
            }
          ]
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        if (this.orienting) {
          window.addEventListener('deviceorientation', this.orient, false)
        }
        else if (this.rotating) {
          window.addEventListener('devicemove', this.rotate, false)
        }
        else {
          document.addEventListener('mousemove', this.move)
        }
      })
      if (this.$store.state.info._id) {
        this.$store.dispatch('getUserTodos', this.info._id)
      }
      this.$refs.layout.toggleLeft()
    },
    beforeDestroy() {
      if (this.orienting) {
        window.removeEventListener('deviceorientation', this.orient, false)
      }
      else if (this.rotating) {
        window.removeEventListener('devicemove', this.rotate, false)
      }
      else {
        document.removeEventListener('mousemove', this.move)
      }
    }
  }
</script>

<style>
  .topbar {
    background-color: rgba(255, 255, 255, .5);
    color: black;
  }

  .logo-container {
    width: 50%;
    height: 242px;
    perspective: 800px;
    position: absolute;
    top: 30%;
    left: 65%;
    transform: translateX(-50%) translateY(-50%);
  }

  .logo {
    position: absolute;
    transform-style: preserve-3d;
  }

  .back {
    background-image: url("~assets/seaBackground.jpg");
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>