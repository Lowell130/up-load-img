<template>
  <div class="container-fluid">
  <div class="container">
    <h1>upload content</h1>
    <div style="margin-bottom:30px;">
      <button class="btn btn-primary" @click="click1">choose photo</button>
      <input
        type="file"
        ref="input1"
        style="display: none"
        @change="previewImage"
        accept="image/*"
      />
    </div>

    <div v-if="imageData != null">
      <img class="preview" height="268" width="356" :src="img1" />
      <br />
    </div>

    <div v-if="uploadValue === 100">
      <p>Image URL:</p>
      <code>{{ img1 }}</code>
    </div>

    <div v-if="uploadValue > 0 && uploadValue < 100">
      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          :style="{ width: uploadValue + '%' }"
          :aria-valuenow="uploadValue"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {{ uploadValue }}%
        </div>
      </div>
    </div>

    <div v-if="fileList.length > 0">
      <h2>Files in Storage:</h2>
     
        <div v-for="(file, index) in fileList" :key="index">
          <a :href="file.url" target="_blank">{{ file.name }}</a>
       </div>
    </div>
  </div>
</div>
</template>

<script>
import firebase from "../../firebase";
export default {
  data() {
    return {
      caption: "",
      img1: "",
      imageData: null,
      uploadValue: 0,
      fileList: [], // List of files
    };
  },
  methods: {
    create() {
      // Rest of your code
    },
    click1() {
      this.$refs.input1.click();
    },
    previewImage(event) {
      const file = event.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.type)) {
        alert("Only images are allowed.");
        return;
      }

      this.uploadValue = 0;
      this.img1 = null;
      this.imageData = file;
      this.onUpload();
    },
    onUpload() {
      this.img1 = null;
      const storageRef = firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.img1 = url;
          });
          this.fetchFilesFromStorage(); // Fetch the updated list of files
        }
      );
    },
    fetchFilesFromStorage() {
  const storageRef = firebase.storage().ref();
  storageRef
    .listAll()
    .then((res) => {
      this.fileList = []; // Empty the fileList array before populating it
      res.items.forEach((itemRef) => {
        itemRef.getDownloadURL().then((url) => {
          this.fileList.push({
            name: itemRef.name,
            url: url,
          });
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching files:", error);
    });
},
  },
  mounted() {
    this.fetchFilesFromStorage(); // Fetch the files when the component is mounted
  },
};
</script>

<style>
  .progress {
    height: 20px;
    width: 100%;
    background-color: #f5f5f5;
  }

  .progress-bar {
    height: 100%;
    color: #fff;
    text-align: center;
    line-height: 20px;
    width: 0;
    background-color: #007bff;
  }
</style>
