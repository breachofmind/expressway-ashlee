<template>
	<div class="al-login-form-container">

		<slot name="header"></slot>

		<div class="al-login-error callout alert" v-if="error">
			<p>{{error}}</p>
		</div>

		<form action="/auth/login" method="POST" class="al-login-form">

			<div class="al-login-username">
				<label for="Input_username">Username</label>
				<input type="text" class="al-login-input is-line-input" name="username" id="Input_username" v-model="input.username" required>
			</div>

			<div class="al-login-password">
				<label for="Input_password">Password</label>
				<input type="password" class="al-login-input is-line-input" name="password" id="Input_password" v-model="input.password" required>
			</div>

			<div class="al-login-submit">
				<button type="submit" class="button expanded al-login-submit-button" :class="buttonStyles" @click.prevent="submit()" :disabled="submitting">
					{{buttonText}}
				</button>
			</div>

			<div class="al-login-links button-group">
				<a href="/" class="button link">Back to Site</a>
				<a href="/auth/login/reset" class="button link">Forgot Password?</a>
			</div>

		</form>

		<slot name="footer"></slot>
	</div>
</template>

<script>
    var SUBMIT_TIMEOUT = 800;

	module.exports = {

		name: "LoginForm",

		data() {
		    return {
		        submitting: false,
			    success: false,
			    error: null,
			    buttonText:"Enter",
			    buttonStyles: ['primary'],
		        input: {
		            username: "",
			        password: ""
		        }
		    }
		},
		methods: {
		    submit()
		    {
		        this.submitting = true;
				this.$api.login(this.input).then(response => {
					this.redirect(response.data.data);
				}).catch(err => {
				    this.error = err.response.data.error;
				    this.submitting = false;
				})
		    },

			redirect(response)
			{
			    this.success = true;
			    this.$emit('success',response);
			    this.buttonStyles = ['success'];
			    this.buttonText = "Welcome " + response.user.first_name;
			    setTimeout(() => {
			        window.location.href = response.redirect;
			    }, SUBMIT_TIMEOUT);
			}
		}

    }
</script>