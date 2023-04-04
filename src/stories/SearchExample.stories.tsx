import { StoryFn, Meta } from '@storybook/react';
import { SearchExample } from './SearchExample';

type Args = { isLoading: boolean; hasError: boolean };

export default {
  title: 'Example/Search',
  component: SearchExample,
} as Meta<typeof SearchExample>;

const Template: StoryFn<typeof SearchExample> = (args) => (
  <SearchExample {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
