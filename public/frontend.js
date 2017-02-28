console.log('Ashlee is connected');

(function() {
    function main()
    {
        var templateId = $('meta[name="templateId"]').attr('content');
        var url = "/cms/template/"+templateId+"/modify";

        $('[data-ashlee]').each(function(i,el)
        {
            var arr = el.getAttribute('data-ashlee').split(":");
            el.$slot = {
                name: arr[0],
                index: arr[1],
                content: el.innerHTML
            };

            $(el).on('blur', function(event)
            {
                var slot = event.target.$slot;

                // Don't trigger the update if the contents did not change.
                if (slot.content == event.target.innerHTML) return;

                // Update the slot contents with the updated contents.
                event.target.$slot.content = event.target.innerHTML;

                // Save the contents.
                $.post(url, slot);
            })
        });
    }


    $(document).ready(main);
})();


