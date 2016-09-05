var React = require('react'),
	ReactRedux = require('react-redux'),
	Header = require('./../containers/header'),
	Dropzone = require('react-dropzone'),
	actions = require("../actions"),
	validator = require('validator'),
	Link = require('react-router').Link;

var Dashboard = React.createClass({
	getInitialState: function () {
		return { error: {}, showPasswordDialog: false };
	},
	onDrop: function (files) {
		this.props.setAvatar(this.props.auth.user.name, files[0]);
	},
	changeAvatar: function (event) {
		this.props.changeAvatar();
	},
	save: function (event) {
		event.preventDefault();
		var profileData = {};
		for (var _item in this.refs) {
			if (_item === 'gender_female' || _item === 'gender_male')
				continue;
			var item = this.refs[_item];
			if (typeof item.value === 'string' && item.value.length && !this.state.error[_item]) {
				profileData[_item] = validator.trim(item.value);
			}
		}
		profileData.gender = this.refs.gender_female.checked ? 'female' : 'male';
		this.setState({ showPasswordDialog: true, profileData: profileData });
	},
	validate: function (refs) {
		var value = this.refs[refs] && this.refs[refs].value;
		switch (refs) {
			case 'email':
				if (!validator.isEmail(value)) {
					this.state.error[refs] = refs + ' in not valid';
					this.setState({ error: this.state.error });
				} else {
					this.state.error[refs] = undefined;
					this.setState({ error: this.state.error });
				}
				break;
			case 'website':
				if (!validator.isURL(value, { require_protocol: true, protocols: ['http', 'https'] })) {
					this.state.error[refs] = refs + ' in not valid';
					this.setState({ error: this.state.error });
				} else {
					this.state.error[refs] = undefined;
					this.setState({ error: this.state.error });
				}
				break;
		}
	},
	closePasswordDialog: function () {
		this.setState({ showPasswordDialog: false });
	},
	savePassword: function () {
		var password = this.refs.password.value;
		this.props.updateProfile(password, this.state.profileData);
		this.setState({ showPasswordDialog: false });
	},
	render: function () {
		const user = this.props.auth.user;
		var profile = typeof user.profile === 'object' ? user.profile : {};
		var avatarSrc = '//img.busy6.com/@' + user.name + '?cb=' + Math.floor(Math.random() * 10000000000);
		var avatarPlaceholder = (<div>
			<img className="avatar-img" src={avatarSrc} onError={this.changeAvatar}/><br />
			<button className="change-avatar-btn" onClick={this.changeAvatar}>Change avatar</button>
		</div>);
		if (user.selectAvatar)
			avatarPlaceholder = (
				<Dropzone className="avatar-dropzone" onDrop={this.onDrop} accept='image/*'>
					<div>Try dropping some files here, or click to select files to upload.</div>
				</Dropzone>);

		let passwordDialog;
		if (this.state.showPasswordDialog)
			passwordDialog = <div className='password-dialog'>
				<i className="icon icon-md material-icons password-close" onClick={this.closePasswordDialog}>close</i>
				<fieldset className={"form-group"}>
					<label className="message">Enter your password to update.</label>
					<input autoFocus type="password" defaultValue='password' placeholder="password" className="form-control form-control-lg input-field" ref="password" />
				</fieldset>
				<fieldset className="form-group"><button className="btn btn-primary" onClick={this.savePassword}>Save</button></fieldset>
			</div>
		return (
			<div className="main-panel">
				<Header />
				<div className="view-app">
					<div className="block">
						<form style={{ maxWidth: '340px', margin: '0 auto' }}>
							{avatarPlaceholder}
							<fieldset className={"form-group"}>
								<input autoFocus type="text" defaultValue={profile.name} placeholder="Name" className="form-control form-control-lg" ref="name" />
							</fieldset>
							<fieldset className={"form-group " + (this.state.error.email ? 'has-danger' : '') }>
								<input type="email" defaultValue={profile.email} placeholder="Email" className="form-control form-control-lg" ref="email" onBlur={this.validate.bind(this, 'email') }/>
								<div className="form-control-feedback">{this.state.error.email}</div>
							</fieldset>
							<fieldset className="form-group">
								<label className="custom-control custom-radio">
									<input name="radio" type="radio" value="male" className="custom-control-input" ref="gender_male" defaultChecked={profile.gender === 'male'}/>
									<span className="custom-control-indicator"></span>
									<span className="custom-control-description">Male</span>
								</label>
								<label className="custom-control custom-radio">
									<input name="radio" type="radio" value="female" className="custom-control-input" ref="gender_female" defaultChecked={profile.gender === 'female'}/>
									<span className="custom-control-indicator"></span>
									<span className="custom-control-description">Female</span>
								</label>
							</fieldset>
							<fieldset className={"form-group"}>
								<textarea className="form-control form-control-lg" defaultValue={profile.about} placeholder="About" rows="3" ref="about"></textarea>
							</fieldset>
							<fieldset className={"form-group"}>
								<input type="text" placeholder="First Name" defaultValue={profile.first_name} className="form-control form-control-lg" ref="first_name" />
							</fieldset>
							<fieldset className={"form-group"}>
								<input type="text" placeholder="Last Name" defaultValue={profile.last_name} className="form-control form-control-lg" ref="last_name" />
							</fieldset>
							<fieldset className={"form-group"}>
								<input type="text" placeholder="Location" defaultValue={profile.location} className="form-control form-control-lg" ref="location" />
							</fieldset>
							<fieldset className={"form-group " + (this.state.error.website ? 'has-danger' : '') }>
								<input type="text"  defaultValue={profile.website} placeholder="Website" className="form-control form-control-lg" ref="website" onBlur={this.validate.bind(this, 'website') } />
								<div className="form-control-feedback">{this.state.error.website}</div>
							</fieldset>
							<fieldset className="form-group"><button className="btn btn-primary" onClick={this.save}>Save</button></fieldset>
						</form>
					</div>
				</div>
				{passwordDialog}
			</div>
		);
	}
});

var mapStateToProps = function (state) {
	return { auth: state.auth };
};

var mapDispatchToProps = function (dispatch) {
	return {
		setAvatar: function (username, img) { dispatch(actions.setAvatar(username, img)); },
		changeAvatar: function () { dispatch(actions.changeAvatar()) },
		updateProfile: function (passwordOrWif, profileData) { dispatch(actions.updateProfile(passwordOrWif, profileData)) }
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Dashboard);