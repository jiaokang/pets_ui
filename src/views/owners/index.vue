<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon>
              <Search />
            </template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon>
              <Refresh />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <div class="mb-10px">
        <el-button v-hasPerm="['businessOwners:businessOwners:add']" type="success" @click="handleOpenDialog()">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button v-hasPerm="['businessOwners:businessOwners:delete']" type="danger" :disabled="removeIds.length === 0"
          @click="handleDelete()">
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </div>

      <el-table ref="dataTableRef" v-loading="loading" :data="pageData" highlight-current-row border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column key="name" label="主人姓名" prop="name" min-width="150" align="center" />
        <el-table-column key="phone" label="主人手机号" prop="phone" min-width="150" align="center" />
        <el-table-column key="email" label="主人邮箱" prop="email" min-width="150" align="center" />
        <el-table-column key="address" label="主人地址" prop="address" min-width="150" align="center" />
        <el-table-column key="createTime" label="创建时间" prop="createTime" min-width="150" align="center" />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button v-hasPerm="['businessOwners:businessOwners:edit']" type="primary" size="small" link
              @click="handleOpenDialog(scope.row.id)">
              <template #icon>
                <Edit />
              </template>
              编辑
            </el-button>
            <el-button v-hasPerm="['businessOwners:businessOwners:delete']" type="danger" size="small" link
              @click="handleDelete(scope.row.id)">
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="handleQuery()" />
    </el-card>

    <!-- 主人信息表单弹窗 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" @close="handleCloseDialog">
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">

        <el-form-item label="主人姓名" prop="name">
          <el-input v-model="formData.name" placeholder="主人姓名" />
        </el-form-item>

        <el-form-item label="主人手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="主人手机号" />
        </el-form-item>

        <el-form-item label="主人邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="主人邮箱" />
        </el-form-item>

        <el-form-item label="主人地址" prop="address">
          <el-input v-model="formData.address" placeholder="主人地址" />
        </el-form-item>



      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit()">确定</el-button>
          <el-button @click="handleCloseDialog()">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "BusinessOwners",
  inheritAttrs: false,
});

import BusinessOwnersAPI, { BusinessOwnersPageVO, BusinessOwnersForm, BusinessOwnersPageQuery } from "@/api/owners/business-owners";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<BusinessOwnersPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 主人信息表格数据
const pageData = ref<BusinessOwnersPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 主人信息表单数据
const formData = reactive<BusinessOwnersForm>({});

// 主人信息表单校验规则
const rules = reactive({
  name: [{ required: true, message: "请输入主人姓名", trigger: "blur" }],
  phone: [{ required: true, message: "请输入主人手机号", trigger: "blur" }],
});

/** 查询主人信息 */
function handleQuery() {
  loading.value = true;
  BusinessOwnersAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置主人信息查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开主人信息弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改主人信息";
    BusinessOwnersAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增主人信息";
  }
}

/** 提交主人信息表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        BusinessOwnersAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        BusinessOwnersAPI.add(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭主人信息弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除主人信息 */
function handleDelete(id?: number) {
  const ids = [id || removeIds.value].join(",");
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      BusinessOwnersAPI.deleteByIds(ids)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

onMounted(() => {
  handleQuery();
});
</script>
