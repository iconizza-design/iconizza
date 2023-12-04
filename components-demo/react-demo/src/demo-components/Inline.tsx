import React from 'react';
import { Icon as OfflineIcon } from '@iconizza/react/dist/offline';
import { Icon as FullIcon } from '@iconizza/react';

export function InlineDemo() {
	return (
		<section className="inline-demo">
			<h1>Inline demo</h1>
			<div>
				Block icon (behaving like image):
				<OfflineIcon
					id="inline-demo-block-offline"
					icon="experiment2"
				/>
				<FullIcon id="inline-demo-block-full" icon="experiment2" />
			</div>
			<div>
				Inline icon (behaving line text / icon font):
				<OfflineIcon
					id="inline-demo-inline-offline"
					icon="experiment2"
					inline={true}
					mode="style"
				/>
				<FullIcon
					id="inline-demo-inline-full"
					icon="experiment2"
					inline={true}
					mode="style"
				/>
			</div>
		</section>
	);
}
