import React from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  const handleNavigate = (href: string, event: React.MouseEvent) => {
    event.preventDefault();
    navigate(href);
  };

  return (
    <BreadcrumbContainer>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {isLast ? (
              <CurrentBreadcrumbItem>{item.label}</CurrentBreadcrumbItem>
            ) : (
              <>
                <BreadcrumbLink
                  href={item.href}
                  onClick={(e) => handleNavigate(item.href, e)}
                >
                  {item.label}
                </BreadcrumbLink>
                <Separator>&gt;</Separator>
              </>
            )}
          </React.Fragment>
        );
      })}
    </BreadcrumbContainer>
  );
};

export default Breadcrumbs;

export const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const BreadcrumbLink = styled.a`
  font-size: 14px;
  color: #666;
  text-decoration: none;
  padding: 0.25rem 0;
  cursor: pointer;
  
  &:hover {
    color: #0066cc;
    text-decoration: underline;
  }
`;

const CurrentBreadcrumbItem = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 600;
  padding: 0.25rem 0;
`;

const Separator = styled.span`
  margin: 0 0.5rem;
  color: #999;
`;