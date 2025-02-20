import request from "@/utils/request";

const BUSINESSOWNERS_BASE_URL = "/api/v1/businessOwnerss";

const BusinessOwnersAPI = {
    /** 获取主人信息分页数据 */
    getPage(queryParams?: BusinessOwnersPageQuery) {
        return request<any, PageResult<BusinessOwnersPageVO[]>>({
            url: `${BUSINESSOWNERS_BASE_URL}/page`,
            method: "get",
            params: queryParams,
        });
    },
    /**
     * 获取主人信息表单数据
     *
     * @param id 主人信息ID
     * @returns 主人信息表单数据
     */
    getFormData(id: number) {
        return request<any, BusinessOwnersForm>({
            url: `${BUSINESSOWNERS_BASE_URL}/${id}/form`,
            method: "get",
        });
    },

    /** 添加主人信息*/
    add(data: BusinessOwnersForm) {
        return request({
            url: `${BUSINESSOWNERS_BASE_URL}`,
            method: "post",
            data: data,
        });
    },

    /**
     * 更新主人信息
     *
     * @param id 主人信息ID
     * @param data 主人信息表单数据
     */
     update(id: number, data: BusinessOwnersForm) {
        return request({
            url: `${BUSINESSOWNERS_BASE_URL}/${id}`,
            method: "put",
            data: data,
        });
    },

    /**
     * 批量删除主人信息，多个以英文逗号(,)分割
     *
     * @param ids 主人信息ID字符串，多个以英文逗号(,)分割
     */
     deleteByIds(ids: string) {
        return request({
            url: `${BUSINESSOWNERS_BASE_URL}/${ids}`,
            method: "delete",
        });
    }
}

export default BusinessOwnersAPI;

/** 主人信息分页查询参数 */
export interface BusinessOwnersPageQuery extends PageQuery {
}

/** 主人信息表单对象 */
export interface BusinessOwnersForm {
    /** 主人唯一标识 */
    id?:  number;
    /** 主人姓名 */
    name?:  string;
    /** 主人手机号 */
    phone?:  string;
    /** 主人邮箱 */
    email?:  string;
    /** 主人地址 */
    address?:  string;
    /** 创建时间 */
    createTime?:  Date;
}

/** 主人信息分页对象 */
export interface BusinessOwnersPageVO {
    /** 主人唯一标识 */
    id?: number;
    /** 主人姓名 */
    name?: string;
    /** 主人手机号 */
    phone?: string;
    /** 主人邮箱 */
    email?: string;
    /** 主人地址 */
    address?: string;
    /** 创建时间 */
    createTime?: Date;
}
