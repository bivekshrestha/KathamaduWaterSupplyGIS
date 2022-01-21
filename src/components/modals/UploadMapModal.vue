<template>
  <div class="modal fade" id="uploadModal" tabindex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-body">
          <div class="uploadsec">
            <div class="uploadmap_wrapper one">
              <div class="item">
                <form data-validation="true" action="#" method="post" enctype="multipart/form-data">
                  <div class="uploadmap-item-inner">
                    <div class="uploadmap-item-content">
                      <div class="uploadmap_upload"><label style="cursor: pointer;" for="file_upload"> <img src=""
                                                                                                            alt=""
                                                                                                            class="uploaded-image">
                        <div class="h-100">
                          <div class="upload_btn">
                            <div class="upload_para"><i class="fas fa-cloud-upload-alt"></i>
                              <h5><b>Choose Your Files/Images to Upload</b></h5>
                              <h6 class="mt-10 mb-70">Or Drop Your Image Here</h6>
                            </div>
                          </div>
                        </div>
                        <!--upload-content--> <input data-required="image" type="file" name="image_name"
                                                     id="file_upload" class="image-input"
                                                     data-traget-resolution="image_resolution" value="">
                      </label></div>
                    </div>
                    <!--item-content-->
                  </div>
                  <!--item-inner-->
                </form>
              </div>
              <!--item-->
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UploadMapModal"
}
</script>

<style scoped>

</style>