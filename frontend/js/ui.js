import { loginTemplate, signupTemplate } from "./templates.js";

export const render = (template, containerSelector = '.box-2') => {
    const container = document.querySelector(containerSelector)
    container.innerHTML = template()
};

export const hideBox1 = () => {
    document.querySelector('.box-1').style.display = 'none';
};

export const showBox1 = () => {
    document.querySelector('.box-1').style.display = 'block';
};
