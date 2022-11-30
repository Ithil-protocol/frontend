/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, useState, useContext } from 'react';
import {
  BookOpen,
  DiscordLogo,
  DotsThree,
  GithubLogo,
  Info,
  MagicWand,
} from 'phosphor-react';
import { ShepherdTourContext } from 'react-shepherd';

import Txt from 'src/components/based/Txt';
import Dropdown from 'src/components/based/Dropdown';
import {
  DISCORD_URL,
  DOC_URL,
  GITHUB_URL,
  WEB_APP_URL,
} from 'src/global/constants';

interface IMenuItem {
  Icon: any;
  label: string;
  url?: string;
  onClick?: () => void;
}

const MenuItem: FC<IMenuItem> = ({ Icon, label, url, onClick }) => {
  return (
    <div tw="flex justify-start items-center gap-3" onClick={onClick}>
      <Icon tw="text-secondary-100" />
      <a href={url} target="_blank" rel="noreferrer">
        <Txt.Body2Regular tw="text-secondary-100">{label}</Txt.Body2Regular>
      </a>
    </div>
  );
};

const KebabMenu = () => {
  const [visible, setVisibility] = useState(false);
  const tour = useContext(ShepherdTourContext);

  return (
    <Dropdown
      action={
        <div
          id="menu"
          css={[
            tw`border-none rounded-md cursor-pointer h-9 tablet:h-10 desktop:h-11 w-9 tablet:w-10 desktop:w-11 px-2 bg-primary-200 relative flex justify-center items-center hover:bg-hover-light dark:hover:bg-hover-dark`,
          ]}
        >
          <DotsThree tw="text-secondary" size={24} />
        </div>
      }
      menu={
        <div tw="rounded-md cursor-pointer flex flex-col justify-start gap-3 py-4 pr-16 pl-4 bg-primary-100 border-1 border-primary-400">
          <MenuItem Icon={Info} label="About" url={WEB_APP_URL} />
          <MenuItem Icon={BookOpen} label="Docs" url={DOC_URL} />
          <MenuItem Icon={GithubLogo} label="Source" url={GITHUB_URL} />
          <MenuItem Icon={DiscordLogo} label="Discord" url={DISCORD_URL} />
          {tour && (
            <MenuItem Icon={MagicWand} label="Tutorial" onClick={tour.start} />
          )}
        </div>
      }
      visible={visible}
      onChange={(val) => setVisibility(val)}
    />
  );
};

export default KebabMenu;
