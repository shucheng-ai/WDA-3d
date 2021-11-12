<template>
  <div id="app">
    <a-progress
      class="loading"
      type="dashboard"
      :percent="progress"
      v-if="!loadingFinished"
    />
    <a-alert
      message="Error"
      :description="errorMsg"
      type="error"
      v-if="showError"
    />
    <div class="driver" v-if="loadingFinished && showDriver">
      <img src="../../assets/images/driver_3d.png" class="driver-3d" />
      <a-icon type="close" class="icon-close" @click="showDriver = false" />
    </div>
    <div id="container"></div>
  </div>
</template>

<script>
import { init } from './index.event';

export default {
  name: 'app3d',
  components: {},
  data() {
    return {
      progress: 0,
      loadingFinished: false,
      showError: false,
      errorMsg: 'some error occurred,please try again later',
      showDriver: true,
    };
  },
  mounted() {
    init.call(this);
    // 判断环境
    if (
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      ) !== null
    ) {
      this.showDriver = false;
    }
  },
};
</script>

<style>
body {
  padding: 0;
  margin: 0;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0.7;
  z-index: 9999;

  display: flex !important;
  justify-content: center;
  align-items: center;
}
.ant-progress-text {
  color: white !important;
}

.driver {
  position: absolute;
  top: 10px;
  right: 10px;
  animation: swing 1.5s ease-in-out 2;
  transform: rotate(0deg);
  transform-origin: top center;
}

@keyframes swing {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
  75% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.driver-3d {
  width: 444px;
  height: 166px;
}
.icon-close {
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px;
  cursor: pointer;
}
</style>
