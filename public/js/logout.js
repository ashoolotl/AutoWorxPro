const logout = async () => {
    alert('cliocked');
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        });
        if (res.data.status == 'success') {
            location.assign('/');
        }
    } catch (err) {
        alert(err.data.message);
    }
};
