<script>
    import Icon from '@iconizza/svelte/dist/OfflineIcon.svelte';
    import checkedIcon from '@iconizza-icons/uil/check-square';
    import uncheckedIcon from '@iconizza-icons/uil/square';

    export let checked;
    export let text;
    export let hint;

    let isChecked = checked;

    let icon;
    let className;
    $: {
		icon = isChecked ? checkedIcon : uncheckedIcon;
		className =
			'checkbox checkbox--' + (isChecked ? 'checked' : 'unchecked');
    }

    function toggle() {
        isChecked = !isChecked;
    }
</script>

<div class="checkbox-container">
    <a href="# " class={className} on:click|preventDefault={toggle}><Icon icon={icon} mode={checked ? 'svg' : 'style'} />{text}</a>
    <small>{hint}</small>
</div>
