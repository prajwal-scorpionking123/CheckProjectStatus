<template>
	<div class="window-class">
		<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
			<div class="container-fluid">
				<a class="navbar-brand" href="#">Project Status</a>
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNavDarkDropdown"
					aria-controls="navbarNavDarkDropdown"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
					<ul class="navbar-nav"></ul>
				</div>
			</div>
		</nav>
		<div class="container mt-2" >
			<div class="row">
				<div class="col-md-3">
					<div class="dropdown">
						<button
							class="btn btn-secondary dropdown-toggle"
							type="button"
							id="dropdownMenuButton"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							{{ inst === '' ? 'Select Instance' : inst }}
						</button>
						<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<a class="dropdown-item" @click="setInstance(`cs`)">CS</a>
							<a class="dropdown-item" @click="setInstance(`cstest`)">CSTEST</a>
							<a class="dropdown-item" @click="setInstance(`csdev`)">CSDEV</a>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="input-group mb-3" v-if="inst === ``">
						<input
							type="text"
							class="form-control"
							v-model="url"
							placeholder="Get Status,Enter Url"
							aria-label="Recipient's username"
							aria-describedby="basic-addon2"
						/>
						<div class="input-group-append">
							<button class="btn btn-outline-warning" type="button" @click="getALLSTATUS()">Get Status</button>
						</div>
					</div>
					<div class="input-group mb-3" v-else>
						<input
							type="text"
							class="form-control"
							placeholder="Get Status,Enter ProjectID"
							v-model="projectID"
							aria-label="Recipient's username"
							aria-describedby="basic-addon2"
						/>
						<div class="input-group-append">
							<button class="btn btn-outline-warning" type="button" @click="getALLSTATUS()">Get Status</button>
						</div>
					</div>
				</div>
			</div>
			<div class="row mt-3">
				<div class="col-md-9" v-if="projects.length > 0">
					<h6>CS Project</h6>
					<table class="table">
						<thead class="thead-dark">
							<tr>
								<th scope="col">ProjectOf</th>
								<th scope="col">ProjectID</th>
								<th scope="col">Action</th>
								<th scope="col">Status</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(project, index) in projects" :key="index">
								<td>{{ project.instance }}</td>
								<td>{{ project.projectId }}</td>
								<td>
									<button class="btn btn-primary" @click="getALLStatusByUrl(project, index)">CheckStatus</button>
								</td>
								<td :class="projectStatus[index] === `Running` ? `text-success` : `text-danger`">
									{{ projectStatus[index] }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="row mt-3">
				<div class="col-md-9" v-if="builds.length > 0">
					<h6>Builds</h6>

					<table class="table">
						<thead class="thead-dark">
							<tr>
								<th scope="col">URL</th>
								<th scope="col">Action</th>
								<th scope="col">Status</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(Build, index) in builds" :key="index">
								<td>{{ Build.url }}</td>
								<td>
									<button class="btn btn-primary" @click="getStatusByUrl(Build, index)">CheckStatus</button>
								</td>
								<td :class="buildStatus[index] === `Running` ? `text-success` : `text-danger`">
									{{ buildStatus[index] }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				projects: [],
				builds: [],
				inst: '',
				instance: { cs: true, cstest: false, csdev: false },
				projectID: '',
				projectStatus: [],
				buildStatus: [],
				url: '',
				flag: false,
			}
		},
		mounted() {
			this.getProjectsMeta()
		},
		methods: {
			getProjectsMeta() {
				axios({
					method: 'POST',
					url: '/server',
					data: {
						GetProjectsMeta: {},
					},
					headers: {
						'content-type': 'application/json',
						'service-header': 'GetProjectsMeta',
					},
				})
					.then((res) => {
						if (res.data.GetProjectsMeta.result.projects != null) {
							this.projects = res.data.GetProjectsMeta.result.projects
							this.projectStatus = Array(this.projects.length).fill('')
						}
						if (res.data.GetProjectsMeta.result.builds != null) {
							this.builds = res.data.GetProjectsMeta.result.builds
							this.buildsStatus = Array(this.builds.length).fill('')
						}
					})
					.catch((err) => {
						console.log(err)
					})
			},
			setInstance(instance) {
				if (instance === 'cs') {
					this.inst = 'cs'
					this.instance.cs = true
					this.instance.cstest = false
					this.instance.csdev = false
					// this.projectID=''
				}
				if (instance === 'cstest') {
					this.inst = 'cstest'
					this.instance.cs = false
					this.instance.cstest = true
					this.instance.csdev = false
					// this.projectID=''
				}
				if (instance === 'csdev') {
					this.inst = 'csdev'
					this.instance.cs = false
					this.instance.cstest = false
					this.instance.csdev = true
					// this.projectID=''
				}
			},
			getALLSTATUS() {
				if (this.inst === '') {
					if (this.url != '') {
						axios({
							method: 'POST',
							url: '/server',
							data: {
								CheckProjectStatus: {
									type: 'build',
									url: this.url,
								},
							},
							headers: {
								'content-type': 'application/json',
								'service-header': 'CheckProjectStatus',
							},
						})
							.then((res) => {
								console.log(res)
								let bkp = [...this.buildStatus]
								bkp.push('Running')
								this.projectStatus = bkp
								this.getProjectsMeta()
							})
							.catch((err) => {
								console.log(err)
								let bkp = [...this.buildStatus]
								bkp.push('Down')
								this.buildStatus = bkp
								this.getProjectsMeta()
							})
					}
				} else {
					if (this.projectID != '') {
						axios({
							method: 'POST',
							url: '/server',
							data: {
								CheckProjectStatus: {
									type: 'project',
									projectId: this.projectID,
									instance: this.inst,
								},
							},
							headers: {
								'content-type': 'application/json',
								'service-header': 'CheckProjectStatus',
							},
						})
							.then((res) => {
								console.log(res)
								let bkp = [...this.projectStatus]
								bkp.push('Running')
								this.projectStatus = bkp
								this.getProjectsMeta()
							})
							.catch((err) => {
								console.log(err)
								let bkp = [...this.projectStatus]
								bkp.push('Down')
								this.projectStatus = bkp
								this.getProjectsMeta()
							})
					}
				}
			},

			getStatusByUrl(build, index) {
				axios({
					method: 'POST',
					url: '/server',
					data: {
						CheckProjectStatus: {
							type: 'build',
							url: build.url,
						},
					},
					headers: {
						'content-type': 'application/json',
						'service-header': 'CheckProjectStatus',
					},
				})
					.then((res) => {
						console.log(res)
						let bkp = [...this.buildStatus]
						bkp[index] = 'Running'
						this.buildStatus = bkp
					})
					.catch((err) => {
						console.log(err)
						let bkp = [...this.buildStatus]
						bkp[index] = 'Down'
						this.buildStatus = bkp
					})
			},

			getALLStatusByUrl(project, index) {
				axios({
					method: 'POST',
					url: '/server',
					data: {
						CheckProjectStatus: {
							type: 'project',
							projectId: project.projectId,
							instance: project.instance,
						},
					},
					headers: {
						'content-type': 'application/json',
						'service-header': 'CheckProjectStatus',
					},
				})
					.then((res) => {
						console.log(res)
						let bkp = [...this.projectStatus]
						bkp[index] = 'Running'
						this.projectStatus = bkp
						// this.projectStatus[index] = 'Running'
					})
					.catch((err) => {
						console.log(err)
						let bkp = [...this.projectStatus]
						bkp[index] = 'Down'
						this.projectStatus = bkp
						// this.projectStatus[index] = 'Down'
					})
			},
		},
	}
</script>
<style scoped>
.window-class{
    overflow: scroll;
  height: calc(100vh - 40px)
}
</style>